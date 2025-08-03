import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  features = [
    {
      icon: '📝',
      title: 'Word Processing',
      description: 'Professional document formatting, editing, and typesetting services'
    },
    {
      icon: '📊',
      title: 'Excel & Data Entry',
      description: 'Accurate data entry, spreadsheet creation, and data analysis'
    },
    {
      icon: '🎨',
      title: 'Design Services',
      description: 'Creative designs for social media, logos, and marketing materials'
    },
    {
      icon: '⚡',
      title: 'Fast Delivery',
      description: 'Quick turnaround times with quality guaranteed'
    },
    {
      icon: '🔒',
      title: 'Secure Platform',
      description: 'Safe payments and confidential handling of your projects'
    },
    {
      icon: '💯',
      title: 'Quality Assured',
      description: 'Vetted freelancers with proven track records'
    }
  ];

  categories = [
    {
      name: 'Word Processing',
      description: 'Document formatting, editing, and typesetting',
      jobCount: 245,
      icon: '📄'
    },
    {
      name: 'Excel & Data Entry',
      description: 'Spreadsheets, data analysis, and database management',
      jobCount: 189,
      icon: '📈'
    },
    {
      name: 'Design Services',
      description: 'Graphics, logos, and social media content',
      jobCount: 156,
      icon: '🎯'
    }
  ];
}