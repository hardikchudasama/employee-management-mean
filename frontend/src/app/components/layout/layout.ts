import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Toast } from 'primeng/toast';
import { Navbar } from '../navbar/navbar';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterOutlet, Toast, Navbar],
  templateUrl: './layout.html',
  styleUrl: './layout.scss'
})
export class Layout {
}