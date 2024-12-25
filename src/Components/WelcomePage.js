import React, { useState, useRef } from "react";
import axios from 'axios';
import html2canvas from "html2canvas";
import { useLocation } from "react-router-dom";
import { jsPDF } from "jspdf";
import EmojiPicker from "emoji-picker-react";


const DigitalScrapbook = () => {
  const [selectedImageContainer, setSelectedImageContainer] = useState(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [chatOpen, setChatOpen] = useState(false); // Toggle Chat window
  const scrapbookRef = useRef(null);
  const location = useLocation();
  const { name } = location.state || {};
  //aichat bot question answer
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");


 // GEMINI AI Start
  async function getAns() {
    setAnswer("Loading.............")
    const response = await axios({
      url:`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${process.env.REACT_APP_GEMINI}`,
      method:'post',
      data:{"contents":[{"parts":[{"text":question}]}
    ],
  },
    });
    setAnswer(response['data']['candidates'][0]['content']['parts'][0]['text']);
  }
  // GEMINI AI ENd

  // Handle image upload
  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imgElement = document.createElement("img");
        imgElement.src = e.target.result;
        imgElement.style.width = "180px"; // Fixed width
        imgElement.style.height = "180px"; // Fixed height
        imgElement.style.objectFit = "cover"; // Ensures the image isn't distorted
        
        // Handle creating the image container
        createImageContainer(imgElement);
      };
      reader.readAsDataURL(file);
    }
  };

  // Create image container
  const createImageContainer = (imgElement) => {
    const imageContainer = document.createElement("div");
    imageContainer.classList.add("image-container");
    imageContainer.style.position = "relative"; // Required for proper caption positioning
  
    const emojiSpan = document.createElement("span");
    emojiSpan.classList.add("emoji"); // Add class for emojis, if needed for styling
    emojiSpan.setAttribute("data-emoji", ""); // We store emoji data for later use
  
    imageContainer.appendChild(imgElement);
    imageContainer.appendChild(emojiSpan); // Add the emoji span below the image
    
    // Add drag event for moving the image around
    imageContainer.setAttribute("draggable", true);
    imageContainer.addEventListener("dragstart", () => {
      setSelectedImageContainer(imageContainer);
    });

    scrapbookRef.current.addEventListener("dragover", (e) => e.preventDefault());
    scrapbookRef.current.addEventListener("drop", (e) => {
      e.preventDefault();
      if (selectedImageContainer) {
        scrapbookRef.current.appendChild(selectedImageContainer);
        setSelectedImageContainer(null);
      }
    });

    scrapbookRef.current.appendChild(imageContainer);
  };

  // const replaceEmoji = (newEmoji) => {
  //   const selectedImage = selectedImageContainer; // This should be the selected image container
  //   if (selectedImage) {
  //     const emojiSpan = selectedImage.querySelector(".emoji");
  //     emojiSpan.textContent = newEmoji; // Update the emoji text content
  //     emojiSpan.setAttribute("data-emoji", newEmoji); // Store the emoji for reference
  //   }
  // };

  // Handle adding stickers using emoji picker
  const handleAddEmoji = (emojiObject) => {
    if (selectedImageContainer) {
      const emojiElement = document.createElement("span");
      emojiElement.textContent = emojiObject.emoji;
      emojiElement.classList.add("sticker");
      emojiElement.style.fontSize = "20px";
      emojiElement.style.position = "absolute";
      emojiElement.style.top = "5px";
      emojiElement.style.right = "5px";

      selectedImageContainer.appendChild(emojiElement);
      setShowEmojiPicker(false);
    } else {
      alert("Please select an image first by clicking on it.");
    }
  };

  // Add caption to selected image
  const handleAddCaption = (captionText) => {
    if (selectedImageContainer) {
      const existingCaption = selectedImageContainer.querySelector(".caption");
      if (existingCaption) {
        existingCaption.textContent = captionText;
      } else {
        const captionElement = document.createElement("div");
        captionElement.classList.add("caption");
        captionElement.textContent = captionText;
        captionElement.style.position = "absolute";
        captionElement.style.bottom = "0";
        captionElement.style.left = "0";
        captionElement.style.width = "100%";
        captionElement.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
        captionElement.style.color = "white";
        captionElement.style.fontSize = "12px";
        captionElement.style.padding = "2px";

        selectedImageContainer.appendChild(captionElement);
      }
    } else {
      alert("Please select an image first by clicking on it.");
    }
  };

  // Download scrapbook as PDF
  const handleDownloadPDF = () => {
    html2canvas(scrapbookRef.current).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
  
      const pageWidth = 210;
      const imgWidth = pageWidth;
      const imgHeight = (canvas.height * pageWidth) / canvas.width;
  
      // Add the header
      const headerText = `${name}'s Digital ScrapBook`; // Customize your header text
      const headerFontSize = 16; // Adjust the font size as needed
      const headerMargin = 10; // Space between the header and the top of the page
  
      // Set header font style and size
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(headerFontSize);
  
      // Position for header (x = 10, y = 10+headerMargin for spacing from top)
      pdf.text(headerText, 10, headerMargin);
  
      // Now add the image below the header
      pdf.addImage(imgData, "PNG", 0, headerMargin + headerFontSize + 5, imgWidth, imgHeight);
  
      // Save the PDF
      pdf.save(name + "-scrapbook.pdf");
    });
  };

  // Close the emoji picker when clicking outside
  const closeEmojiPicker = () => setShowEmojiPicker(false);
  
  // Chat windows
  const toggleChatWindow = () => setChatOpen((prev) => !prev);



  return (
    <>
      <div className="WelcomeContainer">
        <div className="WelcomeBox">
          {name ? (
            <p>
              Great to See You, {name} ☺️! <br /> Let's Start Crafting
            </p>
          ) : (
            <p>No name provided.</p>
          )}
          <div className="controls">
            <input type="file" accept="image/*" onChange={handleImageUpload} className="imgupload" />
            <button onClick={() => setShowEmojiPicker(true)}>Stickers</button>
            <input
              type="text"
              id="caption"
              placeholder="Add a caption"
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  handleAddCaption(e.target.value);
                  e.target.value = "";
                }
              }}
            />
            <button onClick={handleDownloadPDF}>Download as PDF</button>
          </div>
        </div>
      </div>

      {/* Popup modal for Emoji Picker */}
      {showEmojiPicker && (
        <div className="emoji-popup-overlay" onClick={closeEmojiPicker}>
          <div
            className="emoji-popup-content"
            onClick={(e) => e.stopPropagation()} // Prevent closing popup on picker click
          >
            <EmojiPicker onEmojiClick={handleAddEmoji} />
          </div>
        </div>
      )}

      <div
        id="scrapbook"
        className="scrapbook"
        ref={scrapbookRef}
        onClick={(e) => {
          const imageContainer = e.target.closest(".image-container");
          if (imageContainer) {
            if (selectedImageContainer) {
              selectedImageContainer.style.borderColor = "#ccc";
            }
            imageContainer.style.borderColor = "blue";
            setSelectedImageContainer(imageContainer);
          }
        }}
      >
      </div>

      {/* Floating Chat Button */}

<button className="floating-button" onClick={toggleChatWindow}>
  💬
</button>

{chatOpen && (
  <div className="chat-window">
    <div className="chat-header">
      <span>Your AI ChatBot</span>
      <button className="close-button" onClick={toggleChatWindow}>
        ✖️
      </button>
    </div>
    &nbsp;
    <p id="containerparagraph"> Simply share the category of the image, and ask AI to generate the description for you! </p>
    <div className="chat-input">
      <input type="text" value={question} onChange={(e)=>setQuestion(e.target.value)} placeholder="Type your message here..." />
      &nbsp;&nbsp;&nbsp;
      <button onClick={getAns}>Send</button>
    </div>

    <div className="chat-content">
    {name +": "+ question}
      <br />
      <br />
    {"InsightBot:  "+answer}
    </div>
  </div>
)}
    </>
  );
};

export default DigitalScrapbook;