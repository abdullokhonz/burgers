import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { AppService } from "./app.service";
import { HostListener } from "@angular/core";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, ReactiveFormsModule],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  currency = '$';
  loaderShowed = true;
  loader = true;

  orderImageStyle: any;
  mainImageStyle: any;

  form = this.fb.group({
    order: ["", Validators.required],
    name: ["", Validators.required],
    phone: ["", Validators.required],
  })

  productsData: any;
  constructor(private fb: FormBuilder, private appService: AppService) {
  }

  @HostListener('document:mousemove', ['$event'])
  onMouseMove(e: MouseEvent) {
    this.orderImageStyle = {transform: 'translate(-' + ((e.clientX * 0.3) / 8) + 'px, -' + ((e.clientY * 0.3) / 8) + 'px)'};
    this.mainImageStyle = {transform: 'translate(-' + ((e.clientX * 0.3) / 8) + 'px, -' + ((e.clientY * 0.3) / 8) + 'px)'};
  }

  ngOnInit() {
    setTimeout(() => {
      this.loaderShowed = false;
    }, 3000);
    setTimeout(() => {
      this.loader = false;
    }, 4000);
    this.appService.getData().subscribe(data => this.productsData = data);
  }

  scrollTo(target: HTMLElement, burger?: any) {
    target.scrollIntoView({behavior: "smooth"});
    if (burger) {
      this.form.patchValue({order: burger.title + ' (' + burger.price + ' ' + this.currency + ')'});
    }
  }

  confirmOrder() {
    if (this.form.valid) {
      this.appService.sendOrder(this.form.value)
        .subscribe(
          {
            next: (response: any) => {
              alert(response.message);
              this.form.reset();
            },
            error: (response) => {
              alert(response.error.message)
            },
          }
        );
    }
  }

  changeCurrency() {
      let newCurrency = "$";
      let coefficient = 1;

      if (this.currency === "$") {
        newCurrency = "₽";
        coefficient = 92.16;
      } else if (this.currency === "₽") {
        newCurrency = "BYN";
        coefficient = 3.30;
      } else if (this.currency === "BYN") {
        newCurrency = "€";
        coefficient = 0.93;
      } else if (this.currency === "€") {
        newCurrency = "¥";
        coefficient = 7.14;
      } else if (this.currency === "¥") {
        newCurrency = "TJS";
        coefficient = 10.93;
      }
      this.currency = newCurrency;

      this.productsData.forEach((item: any) => {
        item.price = +(item.basePrice * coefficient).toFixed(1);
      })
  }

}
