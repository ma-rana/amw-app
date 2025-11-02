import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import {
  BookOpen,
  Tag,
  Image,
  Lock,
  Users,
  Globe,
  Loader2,
  X,
} from "lucide-react";

const StoryCreateForm = ({ onSubmit, onCancel }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    privacy: "family",
    tags: "",
    imageUrl: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = "Story title is required";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Story description is required";
    }

    if (formData.title.length > 100) {
      newErrors.title = "Title must be less than 100 characters";
    }

    if (formData.description.length > 500) {
      newErrors.description = "Description must be less than 500 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const storyData = {
        ...formData,
        tags: formData.tags
          .split(",")
          .map((tag) => tag.trim())
          .filter((tag) => tag),
        userId: user?.id || "1",
        userIds: [user?.id || "1"],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        inviteCode: generateInviteCode(),
      };

      await onSubmit(storyData);
      onCancel();
    } catch (error) {
      console.error("Error creating story:", error);
      setErrors({ submit: "Failed to create story. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  };

  const generateInviteCode = () => {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5 w-full min-w-0 max-w-full"
    >
      {/* Story Title */}
      <div className="space-y-2">
        <label
          htmlFor="title"
          className="block text-sm font-semibold text-gray-700"
        >
          Story Title <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Enter story title..."
          className={`w-full px-4 py-2.5 bg-gray-50 border-2 ${
            errors.title
              ? "border-red-300 focus:border-red-500"
              : "border-gray-200 focus:border-blue-500"
          } rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 text-sm sm:text-base`}
          maxLength={100}
        />
        {errors.title && (
          <p className="text-sm text-red-600 flex items-center space-x-1">
            <span>•</span>
            <span>{errors.title}</span>
          </p>
        )}
        {formData.title && !errors.title && (
          <p className="text-xs text-gray-500">{formData.title.length}/100</p>
        )}
      </div>

      {/* Description */}
      <div className="space-y-2">
        <label
          htmlFor="description"
          className="block text-sm font-semibold text-gray-700"
        >
          Description <span className="text-red-500">*</span>
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Describe your story..."
          rows={5}
          className={`w-full px-4 py-2.5 bg-gray-50 border-2 ${
            errors.description
              ? "border-red-300 focus:border-red-500"
              : "border-gray-200 focus:border-blue-500"
          } rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 resize-none text-sm sm:text-base`}
          maxLength={500}
        />
        <div className="flex items-center justify-between gap-2 min-w-0">
          {errors.description ? (
            <p className="text-sm text-red-600 flex items-center space-x-1 min-w-0 flex-1">
              <span className="flex-shrink-0">•</span>
              <span className="break-words">{errors.description}</span>
            </p>
          ) : (
            <div className="flex-shrink-0"></div>
          )}
          <p className="text-xs text-gray-500 flex-shrink-0">
            {formData.description.length}/500
          </p>
        </div>
      </div>

      {/* Privacy Setting */}
      <div className="space-y-2">
        <label
          htmlFor="privacy"
          className="block text-sm font-semibold text-gray-700"
        >
          Privacy Setting
        </label>
        <div className="relative">
          <select
            id="privacy"
            name="privacy"
            value={formData.privacy}
            onChange={handleChange}
            className="w-full px-4 py-2.5 bg-gray-50 border-2 border-gray-200 focus:border-blue-500 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 appearance-none cursor-pointer text-sm sm:text-base font-medium"
          >
            <option value="family">👨‍👩‍👧‍👦 Family Only</option>
            <option value="private">🔒 Private</option>
            <option value="public">🌍 Public</option>
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <svg
              className="w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Tags */}
      <div className="space-y-2">
        <label
          htmlFor="tags"
          className="block text-sm font-semibold text-gray-700"
        >
          Tags <span className="text-gray-500 font-normal">(optional)</span>
        </label>
        <input
          type="text"
          id="tags"
          name="tags"
          value={formData.tags}
          onChange={handleChange}
          placeholder="Enter tags separated by commas..."
          className="w-full px-4 py-2.5 bg-gray-50 border-2 border-gray-200 focus:border-blue-500 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 text-sm sm:text-base"
        />
        <p className="text-xs text-gray-500">
          Separate multiple tags with commas
        </p>
      </div>

      {/* Cover Image URL */}
      <div className="space-y-2">
        <label
          htmlFor="imageUrl"
          className="block text-sm font-semibold text-gray-700"
        >
          Cover Image URL{" "}
          <span className="text-gray-500 font-normal">(optional)</span>
        </label>
        <input
          type="url"
          id="imageUrl"
          name="imageUrl"
          value={formData.imageUrl}
          onChange={handleChange}
          placeholder="https://example.com/image.jpg"
          className="w-full px-4 py-2.5 bg-gray-50 border-2 border-gray-200 focus:border-blue-500 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 text-sm sm:text-base"
        />
      </div>

      {/* Error Message */}
      {errors.submit && (
        <div className="p-3 bg-red-50 border-2 border-red-200 rounded-xl">
          <p className="text-sm text-red-700 flex items-center space-x-2">
            <X className="w-4 h-4" />
            <span>{errors.submit}</span>
          </p>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-6 pb-2 lg:pb-4 border-t-2 border-gray-200 min-w-0">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 min-w-0 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl transition-all duration-200 border-2 border-gray-200 hover:border-gray-300 text-sm sm:text-base"
          disabled={isSubmitting}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="flex-1 min-w-0 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 text-sm sm:text-base"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin flex-shrink-0" />
              <span className="truncate">Creating...</span>
            </>
          ) : (
            <>
              <BookOpen className="w-4 h-4 flex-shrink-0" />
              <span className="truncate">Create Story</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export default StoryCreateForm;
