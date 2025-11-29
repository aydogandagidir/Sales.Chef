import React from "react";

interface PageHeaderProps {
  title: string;
  buttonLabel?: string;
  icon?: string;
  onButtonClick?: () => void;
}

export function PageHeader({
  title,
  buttonLabel,
  icon = "save",
  onButtonClick,
}: PageHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-4">
      <h2 className="text-3xl font-bold">{title}</h2>
      {buttonLabel && (
        <button
          onClick={onButtonClick}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg flex items-center gap-2"
          style={{ minWidth: 180 }}
        >
          <span className="material-icons">{icon}</span>
          {buttonLabel}
        </button>
      )}
    </div>
  );
}
