import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="border-t py-4">
      <div className="container flex flex-col items-center justify-between gap-2 md:h-16 md:flex-row">
        <div className="flex flex-col items-center gap-2 px-4 md:flex-row md:gap-2 md:px-0">
          <p className="text-center text-xs leading-loose text-muted-foreground md:text-left">
            Built for the peptide research community. 
            <a href="/privacy" className="font-medium underline underline-offset-4 ml-1">
              Privacy Policy
            </a>
            {" · "}
            <a href="/terms" className="font-medium underline underline-offset-4">
              Terms
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;