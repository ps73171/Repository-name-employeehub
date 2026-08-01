```jsx
import React, {
  useEffect,
} from "react";

function Modal({
  isOpen,
  onClose,
  title,
  children,
  size = "medium",
  showCloseButton = true,
  closeOnOverlayClick = true,
  footer = null,
}) {
  /* -----------------------------------------
     Prevent Background Scroll
     ----------------------------------------- */

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow =
        "hidden";
    } else {
      document.body.style.overflow =
        "";
    }

    return () => {
      document.body.style.overflow =
        "";
    };
  }, [isOpen]);


  /* -----------------------------------------
     ESC Key Handler
     ----------------------------------------- */

  useEffect(() => {
    const handleEscape = (event) => {
      if (
        event.key === "Escape" &&
        isOpen
      ) {
        onClose();
      }
    };

    document.addEventListener(
      "keydown",
      handleEscape
    );

    return () => {
      document.removeEventListener(
        "keydown",
        handleEscape
      );
    };
  }, [
    isOpen,
    onClose,
  ]);


  /* -----------------------------------------
     Do Not Render When Closed
     ----------------------------------------- */

  if (!isOpen) {
    return null;
  }


  /* -----------------------------------------
     Modal Classes
     ----------------------------------------- */

  const modalClasses = [
    "modal",
    `modal-${size}`,
  ].join(" ");


  /* -----------------------------------------
     Overlay Click Handler
     ----------------------------------------- */

  const handleOverlayClick = (
    event
  ) => {
    if (
      closeOnOverlayClick &&
      event.target ===
        event.currentTarget
    ) {
      onClose();
    }
  };


  /* -----------------------------------------
     Render Modal
     ----------------------------------------- */

  return (
    <div
      className="modal-overlay"
      onClick={
        handleOverlayClick
      }
      role="presentation"
    >
      <div
        className={modalClasses}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >

        {/* ---------- Header ---------- */}

        <div className="modal-header">

          <h2
            id="modal-title"
            className="modal-title"
          >
            {title}
          </h2>

          {showCloseButton && (
            <button
              type="button"
              className="modal-close"
              onClick={onClose}
              aria-label="Close modal"
            >
              ×
            </button>
          )}

        </div>


        {/* ---------- Body ---------- */}

        <div className="modal-body">
          {children}
        </div>


        {/* ---------- Footer ---------- */}

        {footer && (
          <div className="modal-footer">
            {footer}
          </div>
        )}

      </div>
    </div>
  );
}

export default Modal;
```
