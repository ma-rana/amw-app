import React, { useState, useRef } from "react";
import mediaService from "../services/mediaService";
import MultiMediaUpload from "../components/MultiMediaUpload";
import RichTextEditor from "../components/RichTextEditor";
import { useNotifications } from "../contexts/NotificationContext";
import { useAuth } from "../contexts/AuthContext";
import {
  X,
  Zap,
  Camera,
  MapPin,
  Tag,
  Users,
  Globe,
  Lock,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Eye,
  Loader2,
} from "lucide-react";

const CreateMomentPage = ({ onSave, onCancel }) => {
  const { showSuccess, showError, sendMomentNotification } = useNotifications();
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    tags: "",
    mediaFiles: [],
    privacy: "public",
    mood: "",
    quickShare: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [currentStep, setCurrentStep] = useState(1);
  const [showPreview, setShowPreview] = useState(false);
  const titleInputRef = useRef(null);
  const cameraInputRef = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleMediaChange = (files) => {
    setFormData((prev) => ({
      ...prev,
      mediaFiles: files,
    }));
  };

  const handleCameraCapture = () => {
    cameraInputRef.current?.click();
  };

  const handleCameraFileSelect = async (e) => {
    const files = e.target.files;
    if (files.length > 0) {
      const newFiles = Array.from(files);
      const currentFiles = formData.mediaFiles || [];

      // Upload captured files to persistent storage and use returned URLs/keys
      try {
        const uploadPromises = newFiles.map((file) => mediaService.uploadFile(file, "moments"));
        const uploadResults = await Promise.all(uploadPromises);
        const updatedFiles = [...currentFiles, ...uploadResults];
        handleMediaChange(updatedFiles);
      } catch (uploadErr) {
        console.error("Camera upload failed:", uploadErr);
        setError(uploadErr.message || "Failed to upload captured media");
      }
    }
    e.target.value = "";
  };

  const handleQuickShare = async () => {
    if (!formData.title.trim()) {
      titleInputRef.current?.focus();
      setError("Please add a title for your moment");
      return;
    }

    setFormData((prev) => ({ ...prev, quickShare: true }));
    await handleSubmit();
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      const tagsArray = formData.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0);

      // Prefer S3 object keys when available to avoid expired signed URLs
      const mediaUrls = formData.mediaFiles.map((file) => file.key || file.url);

      const newMoment = {
        title: formData.title,
        description: formData.description,
        location: formData.location,
        tags: tagsArray,
        mediaUrls: mediaUrls,
        privacy: formData.privacy,
        mood: formData.mood,
        createdAt: new Date().toISOString(),
        userId: user?.id || "1",
      };

      if (onSave) {
        await onSave(newMoment);
        
        // Show success notification
        const message = formData.quickShare 
          ? 'Moment shared instantly! 🚀' 
          : 'Moment created successfully! ✨';
        showSuccess(message);
        
        // Send moment notification to other users
        const authorName = user?.name || user?.username || user?.email || 'Someone';
        sendMomentNotification({ ...newMoment, author: authorName }, 'new');
      }
    } catch (error) {
      console.error("Error creating moment:", error);
      const errorMessage = error.message || "Failed to create moment";
      setError(errorMessage);
      showError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextStep = () => {
    if (currentStep < 3) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const moods = [
    { emoji: "😊", label: "Happy", value: "happy" },
    { emoji: "😍", label: "Excited", value: "excited" },
    { emoji: "🥰", label: "Loved", value: "loved" },
    { emoji: "😌", label: "Peaceful", value: "peaceful" },
    { emoji: "🤗", label: "Grateful", value: "grateful" },
    { emoji: "🎉", label: "Celebrating", value: "celebrating" },
    { emoji: "😎", label: "Cool", value: "cool" },
    { emoji: "🤔", label: "Thoughtful", value: "thoughtful" },
  ];

  const quickTags = [
    "family",
    "friends",
    "travel",
    "food",
    "nature",
    "celebration",
    "work",
    "hobby",
    "fitness",
    "art",
    "music",
    "pets",
  ];

  const addQuickTag = (tag) => {
    const currentTags = formData.tags
      .split(",")
      .map((t) => t.trim())
      .filter((t) => t);
    if (!currentTags.includes(tag)) {
      const newTags = [...currentTags, tag].join(", ");
      setFormData((prev) => ({ ...prev, tags: newTags }));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20 lg:pb-0">
      {/* Header */}
      <div className="bg-white border-b-2 border-gray-200 shadow-sm sticky lg:sticky top-14 lg:top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={onCancel}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-200"
              disabled={isSubmitting}
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-md">
                <Camera className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
                Create Moment
              </h1>
            </div>

            <button
              onClick={handleQuickShare}
              className="flex items-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isSubmitting || !formData.title.trim()}
            >
              {isSubmitting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Zap className="w-4 h-4" />
              )}
              <span className="text-sm sm:text-base">Quick Share</span>
            </button>
          </div>

          {/* Progress Steps */}
          <div className="flex items-center justify-center space-x-4 sm:space-x-8">
            <div
              className={`flex items-center space-x-3 ${
                currentStep >= 1 ? "text-blue-600" : "text-gray-400"
              }`}
            >
              <div
                className={`flex items-center justify-center w-8 h-8 rounded-full border-2 transition-all duration-200 ${
                  currentStep >= 1
                    ? "bg-blue-600 border-blue-600 text-white"
                    : "border-gray-300 text-gray-400"
                }`}
              >
                <span className="text-sm font-medium">1</span>
              </div>
              <span className="text-sm font-medium hidden sm:inline">
                Content
              </span>
            </div>

            <div
              className={`w-8 sm:w-12 h-0.5 ${
                currentStep >= 2 ? "bg-blue-600" : "bg-gray-300"
              } transition-colors duration-200`}
            ></div>

            <div
              className={`flex items-center space-x-3 ${
                currentStep >= 2 ? "text-blue-600" : "text-gray-400"
              }`}
            >
              <div
                className={`flex items-center justify-center w-8 h-8 rounded-full border-2 transition-all duration-200 ${
                  currentStep >= 2
                    ? "bg-blue-600 border-blue-600 text-white"
                    : "border-gray-300 text-gray-400"
                }`}
              >
                <span className="text-sm font-medium">2</span>
              </div>
              <span className="text-sm font-medium hidden sm:inline">
                Media
              </span>
            </div>

            <div
              className={`w-8 sm:w-12 h-0.5 ${
                currentStep >= 3 ? "bg-blue-600" : "bg-gray-300"
              } transition-colors duration-200`}
            ></div>

            <div
              className={`flex items-center space-x-3 ${
                currentStep >= 3 ? "text-blue-600" : "text-gray-400"
              }`}
            >
              <div
                className={`flex items-center justify-center w-8 h-8 rounded-full border-2 transition-all duration-200 ${
                  currentStep >= 3
                    ? "bg-blue-600 border-blue-600 text-white"
                    : "border-gray-300 text-gray-400"
                }`}
              >
                <span className="text-sm font-medium">3</span>
              </div>
              <span className="text-sm font-medium hidden sm:inline">
                Details
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 mt-4">
          <div className="p-4 bg-red-50 border-2 border-red-200 rounded-xl">
            <div className="flex items-center space-x-3 text-red-700">
              <span className="text-lg">⚠</span>
              <span className="text-sm font-medium">{error}</span>
            </div>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 md:py-8">
        {/* Step 1: Content */}
        {currentStep === 1 && (
          <div className="bg-white rounded-2xl border-2 border-gray-200 shadow-lg p-6 md:p-8">
            <div className="space-y-6">
              {/* Title */}
              <div className="space-y-2">
                <label
                  htmlFor="title"
                  className="block text-sm font-semibold text-gray-700"
                >
                  Moment Title <span className="text-red-500">*</span>
                </label>
                <input
                  ref={titleInputRef}
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="What's this moment about?"
                  className="w-full px-4 py-3 text-lg font-semibold bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  maxLength={100}
                />
                <div className="flex justify-end">
                  <span className="text-xs text-gray-500">
                    {formData.title.length}/100
                  </span>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-4">
                <label className="block text-sm font-semibold text-gray-700">
                  Tell your story
                </label>
                <div className="bg-gray-50 border-2 border-gray-200 rounded-xl overflow-hidden">
                  <RichTextEditor
                    value={formData.description}
                    onChange={(value) =>
                      setFormData((prev) => ({ ...prev, description: value }))
                    }
                    placeholder="Share the story behind this moment..."
                  />
                </div>
              </div>

              {/* Mood Selector */}
              <div className="space-y-4">
                <label className="block text-sm font-semibold text-gray-700">
                  How are you feeling?
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {moods.map((mood) => (
                    <button
                      key={mood.value}
                      type="button"
                      onClick={() =>
                        setFormData((prev) => ({ ...prev, mood: mood.value }))
                      }
                      className={`flex flex-col items-center space-y-2 p-4 rounded-xl border-2 transition-all duration-200 ${
                        formData.mood === mood.value
                          ? "bg-blue-50 border-blue-600 text-blue-600"
                          : "bg-gray-50 border-gray-200 text-gray-700 hover:border-blue-300 hover:bg-blue-50"
                      }`}
                    >
                      <span className="text-2xl">{mood.emoji}</span>
                      <span className="text-xs font-medium">{mood.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Media */}
        {currentStep === 2 && (
          <div className="bg-white rounded-2xl border-2 border-gray-200 shadow-lg p-6 md:p-8">
            <div className="space-y-6">
              <div className="text-center space-y-3">
                <div className="flex items-center justify-center space-x-4">
                  <button
                    type="button"
                    onClick={handleCameraCapture}
                    className="p-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-all duration-200 shadow-md hover:shadow-lg"
                    title="Open Camera"
                  >
                    <Camera className="w-6 h-6" />
                  </button>
                  <h3 className="text-xl font-bold text-gray-900">
                    Add Photos & Videos
                  </h3>
                </div>
                <p className="text-gray-600">
                  Make your moment come alive with media or use the camera
                </p>
              </div>

              <input
                ref={cameraInputRef}
                type="file"
                accept="image/*,video/*"
                capture="environment"
                multiple
                onChange={handleCameraFileSelect}
                style={{ display: "none" }}
              />

              <div className="bg-gray-50 border-2 border-gray-200 rounded-xl overflow-hidden">
                <MultiMediaUpload
                  onFilesChange={handleMediaChange}
                  acceptedTypes={[
                    "image/*",
                    "video/*",
                    "audio/*",
                    ".pdf",
                    ".doc",
                    ".docx",
                    ".txt",
                  ]}
                  maxFiles={10}
                  maxFileSize={50 * 1024 * 1024}
                  initialFiles={formData.mediaFiles}
                />
              </div>

              {formData.mediaFiles.length > 0 && (
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Eye className="w-4 h-4 text-blue-600" />
                    <h4 className="text-sm font-medium text-gray-700">
                      Preview ({formData.mediaFiles.length} files)
                    </h4>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {formData.mediaFiles.slice(0, 4).map((file, index) => (
                      <div
                        key={index}
                        className="relative aspect-square bg-gray-100 border-2 border-gray-200 rounded-xl overflow-hidden hover:border-blue-500 transition-colors duration-200"
                      >
                        {file.type?.startsWith("image/") ? (
                          <img
                            src={file.url}
                            alt={`Preview ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="flex items-center justify-center w-full h-full text-4xl">
                            📹
                          </div>
                        )}
                      </div>
                    ))}
                    {formData.mediaFiles.length > 4 && (
                      <div className="flex items-center justify-center aspect-square bg-gray-100 border-2 border-gray-200 rounded-xl text-gray-600">
                        <div className="text-center">
                          <div className="text-2xl font-bold">
                            +{formData.mediaFiles.length - 4}
                          </div>
                          <div className="text-xs">more</div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Step 3: Details */}
        {currentStep === 3 && (
          <div className="bg-white rounded-2xl border-2 border-gray-200 shadow-lg p-6 md:p-8">
            <div className="space-y-8">
              {/* Location */}
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center border-2 border-green-200">
                    <MapPin className="w-5 h-5 text-green-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Location
                  </h3>
                </div>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="Where did this happen?"
                  className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
                />
              </div>

              {/* Tags */}
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center border-2 border-blue-200">
                    <Tag className="w-5 h-5 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">Tags</h3>
                </div>

                <div className="space-y-4">
                  <div className="flex flex-wrap gap-2">
                    {quickTags.map((tag) => {
                      const isSelected = formData.tags
                        .split(",")
                        .map((t) => t.trim())
                        .includes(tag);
                      return (
                        <button
                          key={tag}
                          type="button"
                          onClick={() => addQuickTag(tag)}
                          className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 border-2 ${
                            isSelected
                              ? "bg-blue-600 text-white border-blue-600"
                              : "bg-white text-gray-700 border-gray-200 hover:border-blue-300 hover:text-blue-600"
                          }`}
                        >
                          #{tag}
                        </button>
                      );
                    })}
                  </div>

                  <input
                    type="text"
                    name="tags"
                    value={formData.tags}
                    onChange={handleChange}
                    placeholder="Add custom tags (comma separated)"
                    className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  />
                </div>
              </div>

              {/* Privacy */}
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center border-2 border-purple-200">
                    <Lock className="w-5 h-5 text-purple-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Privacy
                  </h3>
                </div>

                <div className="grid gap-3">
                  <label
                    className={`flex items-center space-x-4 p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                      formData.privacy === "public"
                        ? "bg-green-50 border-green-600"
                        : "bg-white border-gray-200 hover:border-green-300"
                    }`}
                  >
                    <input
                      type="radio"
                      name="privacy"
                      value="public"
                      checked={formData.privacy === "public"}
                      onChange={handleChange}
                      className="sr-only"
                    />
                    <div className="p-2 bg-green-100 rounded-lg">
                      <Globe className="w-5 h-5 text-green-600" />
                    </div>
                    <div className="text-left">
                      <div className="font-semibold text-gray-900">Public</div>
                      <div className="text-sm text-gray-600">
                        Everyone can see this moment
                      </div>
                    </div>
                  </label>

                  <label
                    className={`flex items-center space-x-4 p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                      formData.privacy === "family"
                        ? "bg-blue-50 border-blue-600"
                        : "bg-white border-gray-200 hover:border-blue-300"
                    }`}
                  >
                    <input
                      type="radio"
                      name="privacy"
                      value="family"
                      checked={formData.privacy === "family"}
                      onChange={handleChange}
                      className="sr-only"
                    />
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Users className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="text-left">
                      <div className="font-semibold text-gray-900">
                        Family Only
                      </div>
                      <div className="text-sm text-gray-600">
                        Only family members can see
                      </div>
                    </div>
                  </label>

                  <label
                    className={`flex items-center space-x-4 p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                      formData.privacy === "private"
                        ? "bg-purple-50 border-purple-600"
                        : "bg-white border-gray-200 hover:border-purple-300"
                    }`}
                  >
                    <input
                      type="radio"
                      name="privacy"
                      value="private"
                      checked={formData.privacy === "private"}
                      onChange={handleChange}
                      className="sr-only"
                    />
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <Lock className="w-5 h-5 text-purple-600" />
                    </div>
                    <div className="text-left">
                      <div className="font-semibold text-gray-900">Private</div>
                      <div className="text-sm text-gray-600">
                        Only you can see this moment
                      </div>
                    </div>
                  </label>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Navigation Footer */}
      <div className="bg-white border-t-2 border-gray-200 shadow-lg sticky bottom-0">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between gap-2 sm:gap-4 min-w-0">
            {/* Previous Button */}
            {currentStep > 1 ? (
              <button
                onClick={prevStep}
                className="group flex items-center justify-center space-x-1.5 sm:space-x-2 px-3 sm:px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl transition-all duration-200 border-2 border-gray-200 hover:border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
                disabled={isSubmitting}
              >
                <ChevronLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform duration-200 flex-shrink-0" />
                <span className="text-xs sm:text-sm md:text-base whitespace-nowrap">
                  Previous
                </span>
              </button>
            ) : (
              <div className="flex-shrink-0 w-0 sm:w-auto"></div>
            )}

            {/* Step Indicator - Clean Design */}
            <div className="flex items-center justify-center flex-1 min-w-0 mx-2 sm:mx-4">
              <div className="flex items-center space-x-2 sm:space-x-3 px-3 sm:px-5 py-2.5 bg-white border-2 border-gray-200 rounded-xl shadow-sm">
                <div className="flex items-center space-x-1.5 flex-shrink-0">
                  {[1, 2, 3].map((step) => (
                    <div
                      key={step}
                      className={`w-2 h-2 rounded-full transition-all duration-300 ${
                        currentStep >= step
                          ? "bg-blue-600 scale-110"
                          : "bg-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-xs sm:text-sm font-semibold text-gray-700 whitespace-nowrap">
                  {currentStep} / 3
                </span>
              </div>
            </div>

            {/* Next/Create Button */}
            {currentStep < 3 ? (
              <button
                onClick={nextStep}
                className="group flex items-center justify-center space-x-1.5 sm:space-x-2 px-3 sm:px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
                disabled={currentStep === 1 && !formData.title.trim()}
              >
                <span className="text-xs sm:text-sm md:text-base whitespace-nowrap">
                  Next
                </span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform duration-200 flex-shrink-0" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                className="group flex items-center justify-center space-x-1.5 sm:space-x-2 px-3 sm:px-5 py-2.5 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
                disabled={isSubmitting || !formData.title.trim()}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin flex-shrink-0" />
                    <span className="text-xs sm:text-sm md:text-base whitespace-nowrap">
                      Creating...
                    </span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 group-hover:scale-110 transition-transform duration-200 flex-shrink-0" />
                    <span className="text-xs sm:text-sm md:text-base whitespace-nowrap">
                      Create
                    </span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateMomentPage;
