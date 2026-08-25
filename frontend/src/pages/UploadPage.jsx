import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../context/AppContext';
import { UploadAnimation } from '../components/3d/UploadAnimation';

export const UploadPage = () => {
  const navigate = useNavigate();
  const { addResource, user } = useApp();

  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('');
  const [type, setType] = useState('');
  const [description, setDescription] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState(['Exam Prep', 'Unit 1']);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadState, setUploadState] = useState('idle'); // 'idle' | 'uploading' | 'success'
  const [errorMsg, setErrorMsg] = useState('');

  const handleAddTag = (e) => {
    if (e.key === 'Enter' || e.type === 'blur') {
      e.preventDefault();
      const trimmed = tagInput.trim();
      if (trimmed && !tags.includes(trimmed)) {
        setTags([...tags, trimmed]);
        setTagInput('');
      }
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setTags(tags.filter(t => t !== tagToRemove));
  };

  const processFile = (file) => {
    const sizeInMB = file.size / (1024 * 1024);
    const formattedSize = sizeInMB >= 1 ? `${sizeInMB.toFixed(1)} MB` : `${Math.round(file.size / 1024)} KB`;
    
    // Create Blob Object URL for immediate preview and download
    const blobUrl = URL.createObjectURL(file);

    setSelectedFile({
      name: file.name,
      size: formattedSize,
      rawFile: file,
      blobUrl: blobUrl,
      type: file.type
    });

    if (!title) {
      const cleanName = file.name.replace(/\.[^/.]+$/, "").replace(/[_-]/g, " ");
      setTitle(cleanName);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setErrorMsg("Please provide a resource title.");
      return;
    }
    if (!subject) {
      setErrorMsg("Please select a subject.");
      return;
    }
    if (!type) {
      setErrorMsg("Please select a resource type.");
      return;
    }

    setErrorMsg('');
    setUploadState('uploading');

    setTimeout(() => {
      setUploadState('success');

      const now = new Date();
      const formattedDate = now.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
      const formattedTime = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });

      const isVid = type === 'video' || (selectedFile?.type && selectedFile.type.startsWith('video/'));

      addResource({
        title: title.trim(),
        subject: subject.toUpperCase(),
        type: isVid ? 'VID' : (selectedFile?.name?.endsWith('.pdf') ? 'PDF' : 'Note'),
        size: selectedFile ? selectedFile.size : '2.1 MB',
        fileName: selectedFile?.name || `${title.trim()}.pdf`,
        file_url: selectedFile?.blobUrl || null,
        rawFile: selectedFile?.rawFile || null,
        description: description.trim() || `Study resource for ${subject.toUpperCase()} uploaded by ${user?.full_name || user?.name || 'Kartik'}.`,
        tags: tags,
        author: user?.full_name || user?.name || 'Kartik Sharma',
        uploadedAt: `${formattedDate}, ${formattedTime}`,
        uploadDate: formattedDate,
        uploadTime: formattedTime,
        timeAgo: 'Just now',
        icon: isVid ? 'play_circle' : 'picture_as_pdf',
        iconColor: isVid ? 'text-on-secondary-container' : 'text-primary',
        bgColor: isVid ? 'bg-secondary-container' : 'bg-surface-variant'
      });

      setTimeout(() => {
        navigate('/notes');
      }, 1400);
    }, 1600);
  };

  return (
    <main className="flex-1 w-full flex justify-center items-start pt-4 md:pt-8 pb-16 px-4 md:px-margin-page bg-app-bg">
      <div className="w-full max-w-[800px] bg-surface-container-lowest border border-surface-border rounded-2xl p-6 md:p-10 shadow-modal">
        <div className="mb-6 md:mb-8 border-b border-surface-border pb-4 flex items-center justify-between">
          <div>
            <h1 className="font-headline-sm md:font-headline-md text-headline-sm md:text-headline-md text-on-surface mb-1">
              Upload a Resource
            </h1>
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              Share your academic materials with the hostel community.
            </p>
          </div>
          <div className="hidden sm:flex items-center justify-center w-12 h-12 rounded-xl bg-surface-container-low text-primary shrink-0">
            <span className="material-symbols-outlined text-[28px]">upload_file</span>
          </div>
        </div>

        {errorMsg && (
          <div className="mb-4 p-3 rounded-lg bg-error-container text-on-error-container font-label-sm text-label-sm flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px]">error</span>
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative group">
            <input
              type="file"
              id="fileUpload"
              accept=".pdf,.jpg,.jpeg,.png,.webp,.mp4,.docx,.pptx,.txt"
              onChange={handleFileChange}
              disabled={uploadState === 'uploading'}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10 disabled:cursor-not-allowed"
            />
            
            {/* Dropzone with 3D Preview */}
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-xl p-4 md:p-6 flex flex-col items-center justify-center text-center transition-all duration-200 min-h-[200px] ${
                selectedFile
                  ? 'border-primary/40 bg-surface-container-low/40'
                  : 'border-outline-variant bg-surface group-hover:bg-surface-container-low group-hover:border-primary'
              }`}
            >
              {selectedFile ? (
                <div className="w-full flex flex-col items-center">
                  {/* 3D Upload Animation Scene */}
                  <UploadAnimation
                    uploadState={uploadState}
                    className="w-full h-36"
                  />
                  <div className="mt-1 flex items-center gap-2 text-primary font-semibold text-xs">
                    <span className="material-symbols-outlined text-[16px]">
                      {uploadState === 'success' ? 'check_circle' : 'attachment'}
                    </span>
                    <span>
                      {uploadState === 'success'
                        ? 'Resource uploaded successfully!'
                        : uploadState === 'uploading'
                        ? 'Syncing resource to hostel cloud...'
                        : 'Ready to upload'}
                    </span>
                  </div>
                </div>
              ) : (
                <>
                  <span className="material-symbols-outlined text-outline text-4xl mb-2 group-hover:text-primary transition-colors">
                    cloud_upload
                  </span>
                  <h3 className="font-label-md text-label-md text-on-surface mb-1 font-semibold">
                    Drag & drop your file here
                  </h3>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">
                    or click to browse from your computer
                  </p>
                  <p className="font-label-sm text-[11px] text-on-surface-variant mt-3 opacity-70">
                    Supported formats: PDF, JPG, PNG, MP4, DOCX (Max 50MB)
                  </p>
                </>
              )}
            </div>

            {selectedFile && uploadState === 'idle' && (
              <div className="mt-4 p-4 rounded-lg border border-surface-border bg-surface-container flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-primary text-[24px]">
                    description
                  </span>
                  <div>
                    <p className="font-label-md text-label-md text-on-surface font-semibold line-clamp-1">
                      {selectedFile.name}
                    </p>
                    <p className="font-label-sm text-label-sm text-on-surface-variant">
                      {selectedFile.size}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedFile(null)}
                  className="text-error hover:bg-error-container p-2 rounded-full transition-colors"
                >
                  <span className="material-symbols-outlined text-[20px]">delete</span>
                </button>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2 space-y-2">
              <label htmlFor="title" className="block font-label-md text-label-md text-on-surface font-semibold">
                Resource Title <span className="text-error">*</span>
              </label>
              <input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Midterm Physics Cheatsheet"
                className="w-full border border-surface-border rounded-lg bg-surface-container-lowest px-4 py-3 font-body-md text-body-md text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="subject" className="block font-label-md text-label-md text-on-surface font-semibold">
                Subject <span className="text-error">*</span>
              </label>
              <div className="relative">
                <select
                  id="subject"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full appearance-none border border-surface-border rounded-lg bg-surface-container-lowest px-4 py-3 font-body-md text-body-md text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all cursor-pointer"
                  required
                >
                  <option value="" disabled>Select a subject</option>
                  <option value="CS">Computer Science (COA / DSA / OS)</option>
                  <option value="PHY">Applied Physics</option>
                  <option value="MATH">Mathematics</option>
                  <option value="EE">Electrical Engineering</option>
                  <option value="DBMS">Database Management</option>
                </select>
                <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none">
                  expand_more
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="type" className="block font-label-md text-label-md text-on-surface font-semibold">
                Resource Type <span className="text-error">*</span>
              </label>
              <div className="relative">
                <select
                  id="type"
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="w-full appearance-none border border-surface-border rounded-lg bg-surface-container-lowest px-4 py-3 font-body-md text-body-md text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all cursor-pointer"
                  required
                >
                  <option value="" disabled>Select type</option>
                  <option value="notes">Class Notes / PDF</option>
                  <option value="pyq">PYQs (Past Papers)</option>
                  <option value="video">Video Lecture</option>
                  <option value="assignment">Assignment Solution</option>
                </select>
                <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none">
                  expand_more
                </span>
              </div>
            </div>

            <div className="md:col-span-2 space-y-2">
              <label htmlFor="description" className="block font-label-md text-label-md text-on-surface font-semibold">
                Description <span className="text-on-surface-variant font-normal text-[12px]">(Optional)</span>
              </label>
              <textarea
                id="description"
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Briefly describe what this resource covers (e.g. Unit 1 instruction cycles, solved examples)..."
                className="w-full border border-surface-border rounded-lg bg-surface-container-lowest px-4 py-3 font-body-md text-body-md text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all resize-y"
              ></textarea>
            </div>

            <div className="md:col-span-2 space-y-2">
              <label className="block font-label-md text-label-md text-on-surface font-semibold">
                Tags
              </label>
              <div className="p-2 border border-surface-border rounded-lg bg-surface-container-lowest flex flex-wrap gap-2 items-center focus-within:border-primary focus-within:ring-1 focus-within:ring-primary transition-all">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1.5 px-3 py-1 bg-surface-container-low text-on-surface-variant rounded-full font-label-sm text-label-sm"
                  >
                    <span>{tag}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="hover:text-error transition-colors flex items-center"
                    >
                      <span className="material-symbols-outlined text-[14px]">close</span>
                    </button>
                  </span>
                ))}
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleAddTag}
                  placeholder="Add a tag and press Enter..."
                  className="flex-1 min-w-[160px] border-none bg-transparent focus:ring-0 p-1 font-body-sm text-body-sm text-on-surface placeholder:text-on-surface-variant/50 outline-none"
                />
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-surface-border flex items-center justify-end gap-4">
            <button
              type="button"
              onClick={() => navigate(-1)}
              disabled={uploadState === 'uploading'}
              className="px-6 py-2.5 rounded-lg border border-surface-border bg-surface-container-lowest text-on-surface font-label-md text-label-md hover:bg-surface-container-low transition-colors"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={uploadState === 'uploading'}
              className="relative overflow-hidden px-8 py-2.5 rounded-lg bg-primary text-on-primary font-label-md text-label-md hover:bg-primary/90 transition-all shadow-sm flex items-center justify-center min-w-[170px]"
            >
              {uploadState === 'idle' && (
                <span className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[20px]">upload</span>
                  <span>Upload Resource</span>
                </span>
              )}

              {uploadState === 'uploading' && (
                <div className="flex items-center gap-2 text-on-primary font-bold">
                  <span className="material-symbols-outlined animate-spin text-[20px]">autorenew</span>
                  <span>Uploading...</span>
                  <div className="w-full h-1 bg-primary-container absolute bottom-0 left-0">
                    <div className="h-full bg-white w-2/3 animate-pulse"></div>
                  </div>
                </div>
              )}

              {uploadState === 'success' && (
                <span className="flex items-center gap-2 text-on-primary font-bold">
                  <span className="material-symbols-outlined text-[20px]">check_circle</span>
                  <span>Uploaded!</span>
                </span>
              )}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
};
