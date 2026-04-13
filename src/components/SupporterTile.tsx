import React from "react";
import { Heart } from "lucide-react";

const SupporterTile: React.FC = () => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg w-full transition-colors duration-200 border border-amber-200/80 dark:border-amber-900/50">
      <div className="flex items-center gap-2 mb-3">
        <Heart className="text-amber-500 dark:text-amber-400 shrink-0" size={22} />
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
          Become a supporter
        </h2>
      </div>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
        If this timer helps your training, you can buy me a coffee — it keeps the project going.
      </p>
      <a
        href="https://www.buymeacoffee.com/filshu"
        target="_blank"
        rel="noreferrer"
        className="flex justify-center"
      >
        <img
          src="https://img.buymeacoffee.com/button-api/?text=Buy me a coffee&emoji=&slug=filshu&button_colour=FFDD00&font_colour=000000&font_family=Cookie&outline_colour=000000&coffee_colour=ffffff"
          alt="Buy me a coffee"
          className="max-w-full h-auto"
        />
      </a>
    </div>
  );
};

export default SupporterTile;
