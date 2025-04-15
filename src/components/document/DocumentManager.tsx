
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { FileUp, X, Paperclip, FileText, Image, CheckCircle, Upload, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { ClearanceStatus } from '@/components/shared/StatusBadge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Progress } from '@/components/ui/progress';

interface Document {
  id: string;
  name: string;
  size: number;
  type: string;
  url: string;
  uploadDate: string;
  verified?: boolean;
}

interface DocumentManagerProps {
  requestId: string;
  departmentName: string;
  status: ClearanceStatus;
  existingDocuments?: Document[];
  maxFiles?: number;
  allowedTypes?: string[];
  maxSizeMB?: number;
  isEditable?: boolean;
}

const DocumentManager: React.FC<DocumentManagerProps> = ({
  requestId,
  departmentName,
  status,
  existingDocuments = [],
  maxFiles = 5,
  allowedTypes = ['image/jpeg', 'image/png', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
  maxSizeMB = 5,
  isEditable = true
}) => {
  const [documents, setDocuments] = useState<Document[]>(existingDocuments);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<{[key: string]: number}>({});
  
  useEffect(() => {
    // Update documents if existingDocuments changes
    if (existingDocuments.length > 0) {
      setDocuments(existingDocuments);
    }
  }, [existingDocuments]);
  
  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isEditable || status === 'approved') return;
    setIsDragging(true);
  };
  
  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };
  
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };
  
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    if (!isEditable || status === 'approved') return;
    
    const files = Array.from(e.dataTransfer.files);
    processFiles(files);
  };
  
  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isEditable || status === 'approved') return;
    
    if (e.target.files) {
      const files = Array.from(e.target.files);
      processFiles(files);
      // Reset the input so the same file can be uploaded again if needed
      e.target.value = '';
    }
  };
  
  const processFiles = (files: File[]) => {
    if (documents.length + files.length > maxFiles) {
      toast.error(`You can only upload a maximum of ${maxFiles} files`);
      return;
    }
    
    const validFiles = files.filter(file => {
      if (!allowedTypes.includes(file.type)) {
        toast.error(`File type ${file.type} is not supported`);
        return false;
      }
      
      if (file.size > maxSizeMB * 1024 * 1024) {
        toast.error(`File ${file.name} exceeds the maximum size of ${maxSizeMB}MB`);
        return false;
      }
      
      return true;
    });
    
    if (validFiles.length === 0) return;
    
    uploadFiles(validFiles);
  };
  
  const uploadFiles = (files: File[]) => {
    setIsUploading(true);
    
    // Set initial progress for each file
    const initialProgress: {[key: string]: number} = {};
    files.forEach(file => {
      const fileId = Math.random().toString(36).substring(2, 15);
      initialProgress[fileId] = 0;
    });
    setUploadProgress(initialProgress);
    
    // In a real application, this would upload to a server
    // Here we'll just simulate the upload with progress
    
    const uploads = files.map(file => {
      const fileId = Math.random().toString(36).substring(2, 15);
      
      return new Promise<Document>((resolve) => {
        let progress = 0;
        const interval = setInterval(() => {
          progress += Math.floor(Math.random() * 15) + 5;
          if (progress > 100) progress = 100;
          
          setUploadProgress(prev => ({
            ...prev,
            [fileId]: progress
          }));
          
          if (progress === 100) {
            clearInterval(interval);
            
            // Create a blob URL for the file (this is temporary and for demo purposes only)
            const url = URL.createObjectURL(file);
            
            // Small delay to show 100% completion
            setTimeout(() => {
              resolve({
                id: fileId,
                name: file.name,
                size: file.size,
                type: file.type,
                url,
                uploadDate: new Date().toISOString(),
                verified: false
              });
            }, 500);
          }
        }, 300);
      });
    });
    
    Promise.all(uploads)
      .then(uploadedDocuments => {
        setDocuments(prev => [...prev, ...uploadedDocuments]);
        toast.success(`Successfully uploaded ${uploadedDocuments.length} documents`);
        setUploadProgress({});
      })
      .finally(() => {
        setIsUploading(false);
      });
  };
  
  const removeDocument = (id: string) => {
    if (!isEditable || status === 'approved') return;
    
    setDocuments(prev => prev.filter(doc => doc.id !== id));
    toast.success('Document removed');
  };
  
  const verifyDocument = (id: string) => {
    setDocuments(prev => prev.map(doc => 
      doc.id === id ? { ...doc, verified: true } : doc
    ));
    toast.success('Document verified');
  };
  
  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };
  
  const getIconForFileType = (type: string) => {
    if (type.startsWith('image/')) return <Image className="h-6 w-6 text-blue-500" />;
    return <FileText className="h-6 w-6 text-orange-500" />;
  };
  
  return (
    <Card className="shadow-md">
      <CardHeader className="bg-secondary/20">
        <CardTitle className="text-lg flex items-center">
          <FileText className="mr-2 h-5 w-5" />
          Supporting Documents
        </CardTitle>
        <CardDescription>
          Upload supporting documents for {departmentName} clearance
        </CardDescription>
      </CardHeader>
      <CardContent className="p-4">
        {/* Upload area */}
        {isEditable && status !== 'approved' && documents.length < maxFiles && (
          <div
            className={`border-2 border-dashed rounded-lg p-6 text-center mb-4 ${
              isDragging ? 'border-primary bg-primary/5' : 'border-muted-foreground/20'
            } transition-colors`}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            <Upload className="h-10 w-10 mx-auto text-muted-foreground mb-2" />
            <p className="mb-2 text-sm font-medium">
              Drag and drop files here, or click to browse
            </p>
            <p className="text-xs text-muted-foreground mb-4">
              Supported formats: JPEG, PNG, PDF, DOC, DOCX (Max: {maxSizeMB}MB)
            </p>
            <Button 
              variant="outline" 
              disabled={isUploading}
              onClick={() => document.getElementById(`fileInput-${requestId}`)?.click()}
              className="mx-auto"
            >
              <Paperclip className="mr-2 h-4 w-4" />
              Browse Files
            </Button>
            <input
              id={`fileInput-${requestId}`}
              type="file"
              multiple
              className="hidden"
              accept={allowedTypes.join(',')}
              onChange={handleFileInputChange}
            />
          </div>
        )}
        
        {/* Upload progress */}
        {Object.keys(uploadProgress).length > 0 && (
          <div className="space-y-3 mb-4">
            <h4 className="text-sm font-medium mb-2">Uploading documents...</h4>
            {Object.entries(uploadProgress).map(([fileId, progress]) => (
              <div key={fileId} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span>Uploading file...</span>
                  <span>{progress}%</span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>
            ))}
          </div>
        )}
        
        {/* Document list */}
        {documents.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium mb-2">Uploaded Documents</h4>
            <ScrollArea className="h-[240px] pr-4">
              <div className="space-y-2">
                {documents.map((doc) => (
                  <div 
                    key={doc.id} 
                    className={`flex items-center justify-between p-3 border rounded-md 
                      ${doc.verified ? 'bg-green-50 border-green-200' : ''}`}
                  >
                    <div className="flex items-center space-x-3">
                      {getIconForFileType(doc.type)}
                      <div>
                        <p className="text-sm font-medium">{doc.name}</p>
                        <div className="flex items-center">
                          <p className="text-xs text-muted-foreground">
                            {formatFileSize(doc.size)}
                          </p>
                          {doc.verified && (
                            <span className="ml-2 flex items-center text-xs text-green-600">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Verified
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => window.open(doc.url, '_blank')}
                        title="Open file"
                      >
                        <FileText className="h-4 w-4" />
                      </Button>
                      
                      {isEditable && status === 'pending' && role === 'department' && !doc.verified && (
                        <Button 
                          variant="ghost" 
                          size="icon"
                          className="text-green-600" 
                          onClick={() => verifyDocument(doc.id)}
                          title="Verify document"
                        >
                          <CheckCircle className="h-4 w-4" />
                        </Button>
                      )}
                      
                      {isEditable && status !== 'approved' && !doc.verified && (
                        <Button 
                          variant="ghost" 
                          size="icon"
                          className="text-destructive" 
                          onClick={() => removeDocument(doc.id)}
                          title="Remove file"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
        )}
        
        {/* Empty state */}
        {documents.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <Paperclip className="h-12 w-12 mx-auto mb-2" />
            <p>No documents uploaded yet</p>
            <p className="text-sm">
              {status === 'approved' 
                ? 'No supporting documents were required for this clearance.'
                : 'Upload supporting documents to speed up your clearance approval.'}
            </p>
          </div>
        )}
      </CardContent>
      {status === 'approved' && (
        <CardFooter className="bg-green-50 border-t flex justify-center py-3">
          <div className="flex items-center text-green-600">
            <CheckCircle className="h-5 w-5 mr-2" />
            <span className="text-sm font-medium">Clearance approved</span>
          </div>
        </CardFooter>
      )}
    </Card>
  );
};

export default DocumentManager;
