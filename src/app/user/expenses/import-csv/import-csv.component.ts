import { Component } from '@angular/core';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { ButtonModule } from 'primeng/button';
import { FormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { FileUploadModule } from 'primeng/fileupload';
import { BadgeModule } from 'primeng/badge';
import { ProgressBarModule } from 'primeng/progressbar';
import { CommonModule } from '@angular/common';
import { ExpenseService } from '../../../shared/services/expense.service';

@Component({
  selector: 'app-import-csv',
  standalone: true,
  imports: [ 
    ToastModule, 
    ButtonModule,
    FormsModule,
    DialogModule,
    FileUploadModule,
    BadgeModule,
    ProgressBarModule,
    CommonModule
  ],
  templateUrl: './import-csv.component.html',
  styleUrls: ['./import-csv.component.css']
})
export class ImportCsvComponent {
  displayModal = false;
  selectedFile: File | null = null;
  isDragOver = false;
  totalSize = 0;
  totalSizePercent = 0;
  readonly acceptedFileTypes = '.csv';
  readonly maxFileSize = 5 * 1024 * 1024; // 5MB
  isUploading = false;

  constructor(
    private messageService: MessageService, 
    private expenseService: ExpenseService
  ) {}

  showModalDialog() {
    this.displayModal = true;
  }

  validateFile(file: File): boolean {
    if (!file.name.toLowerCase().endsWith('.csv')) {
      this.messageService.add({
        severity: 'error',
        summary: 'Invalid File Type',
        detail: 'Only CSV files are allowed'
      });
      return false;
    }

    if (file.size > this.maxFileSize) {
      this.messageService.add({
        severity: 'error',
        summary: 'File Too Large',
        detail: `Maximum file size is ${this.formatSize(this.maxFileSize)}`
      });
      return false;
    }

    return true;
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.handleFile(input.files[0]);
    }
  }

  onFileDrop(event: DragEvent) {
    event.preventDefault();
    this.isDragOver = false;
    
    if (event.dataTransfer?.files && event.dataTransfer.files.length > 0) {
      this.handleFile(event.dataTransfer.files[0]);
    }
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
    this.isDragOver = true;
  }

  onDragLeave(event: DragEvent) {
    event.preventDefault();
    this.isDragOver = false;
  }

  handleFile(file: File) {
    if (this.validateFile(file)) {
      this.selectedFile = file;
      this.totalSize = file.size;
      this.totalSizePercent = Math.min(100, (file.size / this.maxFileSize) * 100);
    }
  }

  removeFile(event: Event) {
    event.stopPropagation();
    this.selectedFile = null;
    this.totalSize = 0;
    this.totalSizePercent = 0;
  }

  importFile() {
    if (!this.selectedFile || this.isUploading) return;

    this.isUploading = true;
    const formData = new FormData();
    formData.append('file', this.selectedFile);
  
    this.expenseService.importCsv(formData).subscribe({
      next: (result) => {
        this.messageService.add({ 
          severity: 'success', 
          summary: 'Success', 
          detail: 'CSV file uploaded successfully',
          life: 3000
        });
        
        this.displayModal = false;
        
        // Delay refresh for 3 seconds
        setTimeout(() => {
          window.location.reload();
        }, 3000);
      },
      error: (error) => {
        this.isUploading = false;
        console.error("Upload error:", error);
        this.messageService.add({ 
          severity: 'error', 
          summary: 'Upload Failed', 
          detail: error.message || 'Failed to upload CSV file',
          life: 5000
        });
      },
      complete: () => {
        this.isUploading = false;
      }
    });
  }

  formatSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const dm = 2;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  }
}