import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navbar } from '../navbar/navbar';
import { Toast } from 'primeng/toast';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterOutlet, Navbar,Toast],
  templateUrl: './layout.html',
  styleUrl: './layout.scss'
})
export class Layout {
}