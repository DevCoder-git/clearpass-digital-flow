
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { FileUp, X, Paperclip, FileText, Image, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import { ClearanceStatus } from '@/components/shared/StatusBadge';

interface Document {
  id: string;
  name: string;
  size: number;
  type: string;
  url: string;
  uploadDate: string;
}

interface DocumentUploaderProps {
  requestId: string;
  departmentName: string;
  status: ClearanceStatus;
  existingDocuments?: Document[];
  maxFiles?: number;
  allowedTypes?: string[];
  maxSizeMB?: number;
}

const DocumentUploader: React.FC<DocumentUploaderProps> = ({
  requestId,
  departmentName,
  status,
  existingDocuments = [],
  maxFiles = 5,
  allowedTypes = ['image/jpeg', 'image/png', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
  maxSizeMB = 5
}) => {
  const [documents, setDocuments] = useState<Document[]>(existingDocuments);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  
  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
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
    
    const files = Array.from(e.dataTransfer.files);
    processFiles(files);
  };
  
  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
    
    // In a real application, this would upload to a server
    // Here we'll just simulate the upload
    
    const uploads = files.map(file => {
      return new Promise<Document>((resolve) => {
        setTimeout(() => {
          // Create a blob URL for the file (this is temporary and for demo purposes only)
          const url = URL.createObjectURL(file);
          
          resolve({
            id: Math.random().toString(36).substring(2, 15),
            name: file.name,
            size: file.size,
            type: file.type,
            url,
            uploadDate: new Date().toISOString()
          });
        }, 1000);
      });
    });
    
    Promise.all(uploads)
      .then(uploadedDocuments => {
        setDocuments(prev => [...prev, ...uploadedDocuments]);
        toast.success(`Successfully uploaded ${uploadedDocuments.length} documents`);
      })
      .finally(() => {
        setIsUploading(false);
      });
  };
  
  const removeDocument = (id: string) => {
    setDocuments(prev => prev.filter(doc => doc.id !== id));
    toast.success('Document removed');
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
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Supporting Documents</CardTitle>
        <CardDescription>
          Upload supporting documents for {departmentName} clearance
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Upload area */}
        {status !== 'approved' && documents.length < maxFiles && (
          <div
            className={`border-2 border-dashed rounded-lg p-6 text-center ${
              isDragging ? 'border-primary bg-primary/5' : 'border-muted-foreground/20'
            } transition-colors`}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            <FileUp className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
            <p className="mb-2 text-sm">
              Drag and drop files here, or click to browse
            </p>
            <p className="text-xs text-muted-foreground">
              Supported formats: JPEG, PNG, PDF, DOC, DOCX (Max: {maxSizeMB}MB)
            </p>
            <div className="mt-4">
              <Button 
                variant="outline" 
                disabled={isUploading}
                onClick={() => document.getElementById('fileInput')?.click()}
              >
                <Paperclip className="mr-2 h-4 w-4" />
                Browse Files
              </Button>
              <input
                id="fileInput"
                type="file"
                multiple
                className="hidden"
                accept={allowedTypes.join(',')}
                onChange={handleFileInputChange}
              />
            </div>
          </div>
        )}
        
        {/* Document list */}
        {documents.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Uploaded Documents</h4>
            <div className="space-y-2">
              {documents.map((doc) => (
                <div 
                  key={doc.id} 
                  className="flex items-center justify-between p-3 border rounded-md"
                >
                  <div className="flex items-center space-x-3">
                    {getIconForFileType(doc.type)}
                    <div>
                      <p className="text-sm font-medium">{doc.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatFileSize(doc.size)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => window.open(doc.url, '_blank')}
                      title="Open file"
                    >
                      <FileText className="h-4 w-4" />
                    </Button>
                    {status !== 'approved' && (
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
        <CardFooter className="bg-green-50 border-t flex justify-center py-4">
          <div className="flex items-center text-green-600">
            <CheckCircle className="h-5 w-5 mr-2" />
            <span className="text-sm font-medium">Clearance approved</span>
          </div>
        </CardFooter>
      )}
    </Card>
  );
};

export default DocumentUploader;
