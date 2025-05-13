import type { FC } from 'react';
import { useState } from 'react';

const dashboardsProduction = [
  { id: 1, name: 'Dashboard Kili', url: 'https://dashboard.jobox.ai' },
  { id: 2, name: 'Dashboard Taluspay', url: 'https://dashboard.taluspay.com' },
  {
    id: 3,
    name: 'Dashboard Risk Radar',
    url: 'https://dashboard.taluspay.com/risk-radar',
  },
];

const dashboardsStaging = [
  {
    id: 1,
    name: 'Dashboard Kili',
    url: 'https://dashboard-staging.joboxserver.com',
  },
  {
    id: 2,
    name: 'Dashboard Taluspay',
    url: 'https://dashboard.taluspay-staging.com',
  },
  {
    id: 3,
    name: 'Dashboard Risk Radar',
    url: 'https://dashboard.taluspay-staging.com/risk-radar',
  },
];

type AppsIconProps = {
  dashboardEnv: string;
};

export const AppsIcon: FC<AppsIconProps> = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { hostname } = window.location;

  const internalDashboards =
    hostname === 'localhost' || hostname?.includes('staging')
      ? dashboardsStaging
      : dashboardsProduction;

  // Toggle dropdown visibility
  const toggleDropdown = (): void => {
    setIsOpen(!isOpen);
  };

  return (
    <div
      className="google-apps-icon-container"
      style={{ position: 'relative' }}
    >
      {/* Google Apps Icon */}
      <div
        onClick={toggleDropdown}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            toggleDropdown();
          }
        }}
        role="button"
        tabIndex={0}
        style={{
          width: '30px',
          height: '30px',
          display: 'grid',
          gridTemplateRows: 'repeat(3, 1fr)',
          gridTemplateColumns: 'repeat(3, 1fr)',
          cursor: 'pointer',
        }}
      >
        {Array.from({ length: 9 }).map(() => (
          <div
            key={`google-apps-icon-${Math.random().toString(36).substr(2, 9)}`}
            style={{
              width: '2px',
              height: '2px',
              backgroundColor: '#8c8c8c',
              margin: '1px',
              borderRadius: '50%',
            }}
          />
        ))}
      </div>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          style={{
            position: 'absolute',
            top: '40px',
            right: '0',
            backgroundColor: '#fff',
            border: '1px solid #ccc',
            boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
            zIndex: 1000,
            padding: '10px',
            minWidth: '200px',
          }}
        >
          <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
            {internalDashboards.map((dashboard) => (
              <li
                key={dashboard.id}
                style={{
                  marginBottom: '8px',
                }}
              >
                <a
                  href={dashboard.url}
                  style={{
                    textDecoration: 'none',
                    color: '#007bff',
                    fontSize: '14px',
                    display: 'block', // Ensure hover applies to the entire block
                    padding: '8px', // Add padding for better clickability
                    borderRadius: '4px', // Rounded corners
                    transition: 'background-color 0.3s ease', // Smooth transition
                  }}
                  onMouseEnter={(e) => {
                    (e.target as HTMLElement).style.backgroundColor = '#f0f8ff';
                  }} // Hover background color
                  onMouseLeave={(e) => {
                    (e.target as HTMLElement).style.backgroundColor = '';
                  }} // Reset background
                >
                  {dashboard.name}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
