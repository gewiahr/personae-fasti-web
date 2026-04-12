import React, { useState } from 'react'

type CopyTextProps = {
  text: string;
  className?: string;
};

const CopyText: React.FC<CopyTextProps> = ({ text, className }) => {
  const [usernameCopied, setUsernameCopied] = useState<boolean>(false);

  const copyUsername = () => {
    navigator.clipboard.writeText(text);
    setUsernameCopied(true);
    setTimeout(() => setUsernameCopied(false), 1500);
  };

  return (
    <p  className={`${className} inline-flex items-center gap-2 px-3 py-2 rounded-lg text-md transition-colors select-none cursor-pointer ~
                  ${usernameCopied 
                    ? 'bg-green-100 text-green-700 border border-green-200' 
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-200 not-italic'
                  }`} 
        onClick={copyUsername}
    >
      {usernameCopied ? `Скопировано` : text}
    </p>
  );
};

export default CopyText;
