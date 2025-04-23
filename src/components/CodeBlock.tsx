
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

interface CodeBlockProps {
  code: string;
  language?: string;
  className?: string;
  maxHeight?: number;
}

const CodeBlock: React.FC<CodeBlockProps> = ({ 
  code, 
  language = "", 
  className = "",
  maxHeight = 420
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [displayCode, setDisplayCode] = useState(code);

  useEffect(() => {
    // Update displayed code when code prop changes
    setDisplayCode(code);
  }, [code]);

  // If code is longer than 50,000 characters, truncate it
  const isLargeFile = code.length > 50000;

  return (
    <div className="w-full">
      <pre
        className={`overflow-x-auto rounded bg-black/80 text-sm p-4 text-white font-mono ${className}`}
        style={{ 
          maxHeight: isExpanded ? 'none' : maxHeight,
          position: 'relative'
        }}
      >
        <code>{isLargeFile && !isExpanded ? `${displayCode.slice(0, 50000)}...` : displayCode}</code>
      </pre>
      
      {(isLargeFile || displayCode.split('\n').length > 100) && (
        <div className="flex justify-center mt-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-xs"
          >
            {isExpanded ? "Collapse Code" : "Show Full Code"}
          </Button>
        </div>
      )}
    </div>
  );
};

export default CodeBlock;