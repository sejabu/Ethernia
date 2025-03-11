// Modal.tsx (or components/Modal.tsx in Next.js project)
import React, { useRef, useEffect } from 'react';
import { useOnClickOutside } from 'usehooks-ts'; // Install if not already installed: npm install usehooks-ts

interface ModalProps {
  isOpen: boolean;
  isDisabled?: boolean;
  onModalClose: () => void;
  onSubmit: () => void;
  children?: React.ReactNode;
  header?: React.ReactNode;
  footer?: React.ReactNode; // Although footer slot is not fully used in Vue, let's add it for flexibility
  name?: string;
}

interface ModalSubComponents {
    Header: React.FC<{ children: React.ReactNode }>;
    Children: React.FC<{ children: React.ReactNode }>;
  }

const Modal: React.FC<ModalProps> & ModalSubComponents= ({
  isOpen,
  isDisabled = false,
  onModalClose,
  onSubmit,
  children,
  header,
  footer // Not used in Vue's footer slot fully but added for completeness
}) => {

  const targetRef = useRef<HTMLDivElement>(null);

  useOnClickOutside(targetRef, () => {
    if (isOpen) { // Only close if the modal is open
      onModalClose();
    }
  });

  if (!isOpen) {
    return null;
  }

  return (
    <div
      id="hs-scale-animation-modal"
      tabIndex={-1}
      className="flex backdrop-blur overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full"
      onClick={onModalClose} // Click on the backdrop to close
    >
      <div className="relative p-4 w-full max-w-2xl max-h-full mx-auto">
        <div
          className="relative bg-white rounded-lg shadow dark:bg-gray-700"
          onClick={(e) => e.stopPropagation()} // Stop event bubbling on modal content
          ref={targetRef} // Ref for onClickOutside
        >
          <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
            {header || <span>Hi</span>} {/* Header slot */}
          </div>
          <div className="modal-body">
            {children || 'default content'} {/* Content slot using children prop */}
          </div>
          <div className="flex items-end p-4 md:p-5 border-t border-gray-200 rounded-b dark:border-gray-600">
            <button
              disabled={isDisabled}
              type="button"
              className={`ml-auto text-right float-right ${isDisabled ? 'cursor-not-allowed bg-blue-700 hover:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-700' : 'bg-blue-700 hover:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-700'}  focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 dark:focus:ring-blue-800 inline-flex items-center`}
              onClick={onSubmit}
            >
              {isDisabled ? (
                <>
                  <svg
                    aria-hidden="true"
                    role="status"
                    className="inline w-4 h-4 me-3 text-white animate-spin"
                    viewBox="0 0 100 101"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                      fill="#E5E7EB"
                    />
                    <path
                      d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                      fill="currentColor"
                    />
                  </svg>
                  Refreshing
                </>
              ) : (
                <>
                  Continue
                  <svg
                    className="rtl:rotate-180 w-3.5 h-3.5 ms-2"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 14 10"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M1 5h12m0 0L9 1m4 4L9 9"
                    />
                  </svg>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

Modal.Header = ({ children }) => (
    <div className="mb-4">
      {children}
    </div>
  );
  
  Modal.Children = ({ children }) => (
    <div className="modal-content">
      {children}
    </div>
  );

export {Modal};