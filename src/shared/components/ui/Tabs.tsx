import React, { useState } from 'react';

interface Tab {
  id: string;
  label: string;
  icon?: React.ReactNode;
  disabled?: boolean;
}

interface TabsProps {
  tabs: Tab[];
  defaultTab?: string;
  onChange?: (tabId: string) => void;
  children: React.ReactNode;
  className?: string;
}

interface TabPanelProps {
  tabId: string;
  children: React.ReactNode;
}

const Tabs: React.FC<TabsProps> = ({
  tabs,
  defaultTab,
  onChange,
  children,
  className = ''
}) => {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id);

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    onChange?.(tabId);
  };

  return (
    <div className={className}>
      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => !tab.disabled && handleTabChange(tab.id)}
              disabled={tab.disabled}
              className={`
                flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap
                transition-colors duration-200
                ${activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }
                ${tab.disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
              `}
            >
              {tab.icon && (
                <span className="flex-shrink-0">{tab.icon}</span>
              )}
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="mt-6">
        {React.Children.map(children, (child) => {
          if (React.isValidElement<TabPanelProps>(child)) {
            return child.props.tabId === activeTab ? child : null;
          }
          return null;
        })}
      </div>
    </div>
  );
};

const TabPanel: React.FC<TabPanelProps> = ({ children }) => {
  return <div>{children}</div>;
};

export { Tabs, TabPanel };