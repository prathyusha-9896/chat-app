'use client';
import React, { useState } from 'react';
import { BiExport } from "react-icons/bi";
import { LuRefreshCw } from "react-icons/lu";
import { MdExitToApp, MdGroup } from "react-icons/md";

interface Group {
  id: number;
  group_name: string;
  project: string;
  labels: string[];
  last_active: string;
}

interface SidePanelProps {
  group: Group;
}

const SidePanel: React.FC<SidePanelProps> = ({ group }) => {
  const [activeTab, setActiveTab] = useState("overview");

  const getRelativeTime = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const isToday =
      date.getDate() === now.getDate() &&
      date.getMonth() === now.getMonth() &&
      date.getFullYear() === now.getFullYear();

    if (isToday) {
      return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    }

    const diffInMs = now.getTime() - date.getTime();
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    return diffInDays === 1 ? "Yesterday" : `${diffInDays} days ago`;
  };

  const renderContent = () => {
    switch (activeTab) {
      case "overview":
        return (
          <div>
            <h3 className="font-medium text-gray-800 text-sm mb-3">Overview</h3>
            <div className="flex flex-col space-y-3 text-sm text-gray-600">
              <div className="flex items-center justify-between">
                <span className="font-medium">Last Active:</span>
                <span>{getRelativeTime(group.last_active)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-medium">Disappearing Messages:</span>
                <span>OFF</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-medium">Send Message Permission:</span>
                <span>All</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-medium">Project:</span>
                <span
                  className={`${
                    group.project.toLowerCase() === "client"
                      ? "text-orange-500"
                      : "text-purple-500"
                  }`}
                >
                  #{group.project}
                </span>
              </div>
            </div>
          </div>
        );

      case "members":
        return (
          <div>
            <h3 className="font-medium text-gray-800 text-sm mb-3">Members</h3>
            <p className="text-sm text-gray-600">List of members will go here.</p>
          </div>
        );

      case "logs":
        return (
          <div>
            <h3 className="font-medium text-gray-800 text-sm mb-3">Logs</h3>
            <p className="text-sm text-gray-600">Activity logs will go here.</p>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="w-1/4 bg-white shadow-lg h-screen flex flex-col p-4">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="bg-gray-200 rounded-full w-10 h-10 flex items-center justify-center">
            <MdGroup className="text-gray-500 w-6 h-6" />
          </div>
          <h2 className="text-lg font-semibold">{group.group_name}</h2>
        </div>
        <button className="text-gray-500 hover:text-gray-700 flex items-center space-x-2"><LuRefreshCw/><span>Refresh</span></button>
      </div>

      {/* Tab Navigation */}
      <div className="flex border-b mb-4">
        {["overview", "members", "logs"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`text-sm px-4 py-2 ${
              activeTab === tab
                ? "text-green-600 border-b-2 border-green-600 font-semibold"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div>{renderContent()}</div>

      {/* Labels Section */}
      <div className="mt-4">
        <span className="font-medium text-sm text-gray-600">Labels:</span>
        <div className="flex items-center mt-2 gap-2 flex-wrap">
          {group.labels.map((label, index) => (
            <span
              key={index}
              className={`px-2 py-1 text-xs rounded-full font-medium ${
                label.toLowerCase() === "high v"
                  ? "bg-red-100 text-red-600"
                  : label.toLowerCase() === "priority"
                  ? "bg-green-100 text-green-600"
                  : label.toLowerCase() === "warm"
                  ? "bg-orange-100 text-orange-600"
                  : "bg-gray-200 text-gray-600"
              }`}
            >
              {label}
            </span>
          ))}
          <button className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-500 border border-gray-300 hover:bg-gray-200">
            + Add Label
          </button>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col space-y-4 my-6">
        <button className="flex items-center space-x-2 text-sm text-gray-500 hover:underline">
          <BiExport className="w-4 h-4 text-gray-500" />
          <span>Export Chat</span>
        </button>
        <button className="flex items-center space-x-2 text-sm text-red-500 hover:underline">
          <MdExitToApp className="w-4 h-4 text-red-500" />
          <span>Exit Group</span>
        </button>
      </div>

      {/* Issues Section */}
      <div className="mt-4">
        <h3 className="font-semibold text-gray-800 text-sm mb-3">Issues</h3>
        <div className="p-4 bg-white rounded-lg shadow-sm flex items-start space-x-3">
          <div className="w-4 h-4 rounded-full border-2 border-red-500 flex items-center justify-center">
            <div
              className="w-2 h-2 rounded-full bg-red-500"
              style={{
                boxShadow: "0 0 6px rgba(220, 38, 38, 0.6)",
              }}
            ></div>
          </div>
          <div>
            <p className="text-xs text-gray-500">
              PER-011 | {group.group_name}
            </p>
            <h4 className="text-sm font-medium text-gray-800">
              Issues with mentions on groups
            </h4>
            <div className="flex items-center space-x-2 text-xs text-gray-500 mt-1">
              <span className="flex items-center space-x-1">
                <svg
                  className="w-4 h-4 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M3 10h11M9 21V3m0 18h9a3 3 0 003-3V6a3 3 0 00-3-3H9m0 0H5a2 2 0 00-2 2v6a2 2 0 002 2h4z"></path>
                </svg>
                <span>Dec 22</span>
              </span>
              <span>•</span>
              <span className="text-gray-800 font-medium">Client</span>
              <span>•</span>
              <span>3 days</span>
            </div>
          </div>
          <div className="ml-auto text-gray-500">
            <div className="w-6 h-6 flex items-center justify-center rounded-full bg-gray-200">
              <span className="text-xs font-medium text-gray-700">H</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SidePanel;