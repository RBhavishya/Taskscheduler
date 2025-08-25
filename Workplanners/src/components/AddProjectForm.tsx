import React, { useState } from "react";

export interface ProjectData {
  id:number
  title: string;
  description: string;
  links?: string[];
}

interface AddProjectFormProps {
  nextId: number;
  onSave?: (data: ProjectData) => void;
  onCancel?: () => void;
}

const AddProjectForm: React.FC<AddProjectFormProps> = ({
  nextId,
  onSave,
  onCancel,
}) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [links, setLinks] = useState<string[]>([]);
  const [linkInput, setLinkInput] = useState("");

  const handleAddLink = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && linkInput.trim() !== "") {
      e.preventDefault();
      setLinks([...links, linkInput.trim()]);
      setLinkInput("");
    }
  };

  const handleRemoveLink = (index: number) => {
    setLinks(links.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    const projectData: ProjectData & { id: number } = {
      id: nextId,
      title,
      description,
      links,
    };
    if (onSave) onSave(projectData);
    console.log("Project Saved:", projectData);
    resetForm();
    if (onCancel) onCancel();
  };

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setLinks([]);
    setLinkInput("");
  };

  return (
    <div className="mt-6 p-6 bg-white shadow rounded-xl border max-w-lg">
      <h2 className="text-lg font-semibold mb-4">Add Project</h2>

      {/* Project Title */}
      <div className="flex flex-col gap-2 mb-4">
        <label className="text-sm font-medium">Project Title</label>
        <input
          type="text"
          placeholder="Enter Project Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border rounded-lg p-2 outline-none focus:ring-2 focus:ring-purple-500"
        />
      </div>

      {/* Project Description */}
      <div className="flex flex-col gap-2 mb-4">
        <label className="text-sm font-medium">Project Description</label>
        <textarea
          placeholder="Enter Project Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full border rounded-lg p-2 outline-none focus:ring-2 focus:ring-purple-500"
        />
      </div>

      {/* Project Links */}
      <div className="flex flex-col gap-2 mb-4">
        <label className="text-sm font-medium">Project Reference Links</label>
        <div className="border rounded-lg p-2 flex flex-wrap gap-2 min-h-[48px]">
          {links.map((link, index) => (
            <span
              key={index}
              className="flex items-center gap-2 bg-purple-50 text-purple-600 px-3 py-1 rounded-full text-sm"
            >
              {link}
              <button
                type="button"
                className="text-xs text-purple-500 hover:text-purple-700"
                onClick={() => handleRemoveLink(index)}
              >
                ✕
              </button>
            </span>
          ))}
          <input
            type="text"
            placeholder="Add a link and press Enter"
            value={linkInput}
            onChange={(e) => setLinkInput(e.target.value)}
            onKeyDown={handleAddLink}
            className="flex-1 outline-none bg-transparent text-sm"
          />
        </div>
      </div>

      {/* Footer Buttons */}
      <div className="flex justify-end gap-2 mt-4">
        <button
          onClick={onCancel}
          className="px-4 py-2 border rounded-lg text-purple-500 hover:bg-gray-100"
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
        >
          Save
        </button>
      </div>
    </div>
  );
};

export default AddProjectForm;
