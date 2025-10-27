import React from 'react';

interface HorizontalSectionProps {
  title: string;
  children: React.ReactNode;
}

export function HorizontalSection({ title, children }: HorizontalSectionProps) {
  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-2xl font-bold">{title}</h2>
      <div className="flex gap-4 overflow-x-auto p-2">
        {children}
      </div>
    </div>
  );
}