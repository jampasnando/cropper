import { Component, ViewChild, AfterViewInit, ElementRef } from '@angular/core';
import { ImageCroppedEvent, ImageCropperModule, ImageCropperComponent } from 'ngx-image-cropper';
import { Observable } from 'rxjs';
import { Camera,CameraOptions } from '@ionic-native/camera/ngx';
import { Platform } from '@ionic/angular';
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements AfterViewInit {
myImage=null;
croppedImage=null;
xx1=0;
yy1=0;
xx2=0;
yy2=0;
@ViewChild(ImageCropperComponent,{static:false}) angularCropper:ImageCropperComponent;
@ViewChild('imageCanvas',{static:false}) canvas:ElementRef;
ctx:CanvasRenderingContext2D;
canvasElement:any;

  constructor(private camera:Camera,private plt:Platform ) {}
  ngAfterViewInit(){
    this.canvasElement=this.canvas.nativeElement;
    // this.canvasElement.height=300;
    this.canvasElement.width=this.plt.width();
  }
  captureImage(){
    this.convertFileToDataURLviaFileReader('assets/foto.jpg').subscribe(base64=>{
      this.myImage=base64;
      // console.log("mi imagen: ",this.myImage);
    });
    // const options:CameraOptions={
    //   quality:100,
    //   destinationType:this.camera.DestinationType.DATA_URL,
    //   encodingType:this.camera.EncodingType.JPEG,
    //   mediaType:this.camera.MediaType.PICTURE,
    //   sourceType:this.camera.PictureSourceType.CAMERA
    // }
    // this.camera.getPicture(options).then((imagen)=>{
    //   this.myImage='data:image/jpeg;base64,' + imagen;
    // });
  }
  convertFileToDataURLviaFileReader(url:string){
    console.log("url: ",url);
    return Observable.create(observer=>{
      console.log("observer: ",observer);
      let xhr:XMLHttpRequest=new XMLHttpRequest();
      xhr.onload=function(){
        console.log("dentro xhr.onlad");
        let reader:FileReader=new FileReader();
        reader.onloadend=function(){
          console.log("dentro reade.onloadend");
          observer.next(reader.result);
          observer.complete();
        };
        reader.readAsDataURL(xhr.response);
      };
      xhr.open('GET',url);
      xhr.responseType='blob';
      xhr.send();
    });
  }

  clear(){
    this.angularCropper.imageBase64=null;
    this.myImage=null;
    this.croppedImage=null;
  }
  save(){
    this.angularCropper.crop();
  }
  imageCropped(event:ImageCroppedEvent){
    this.croppedImage=event.base64;
    this.xx1=this.angularCropper.cropper.x1;
    this.yy1=this.angularCropper.cropper.y1;
    this.xx2=this.angularCropper.cropper.x2;
    this.yy2=this.angularCropper.cropper.y2;
    console.log("(x1,y1): ",this.angularCropper.cropper.x1,",",this.angularCropper.cropper.y1);
    console.log("(x2,y2): ",this.angularCropper.cropper.x2,",",this.angularCropper.cropper.y2);
  }
  rotateLeft(){
    this.angularCropper.rotateLeft();
  }
  rotateRight(){
    this.angularCropper.rotateRight();
  }
  flipHorizontal(){
    this.angularCropper.flipHorizontal();
  }
  flipVertical(){
    this.angularCropper.flipVertical();
  }
  move(x,y){
    this.angularCropper.cropper.x1 +=x;
    this.angularCropper.cropper.x2 +=x;
    this.angularCropper.cropper.y1 +=y;
    this.angularCropper.cropper.y2 +=y;

  }
  moved(ev){
    console.log("mover: ",ev);
  }
  accion(){
    this.canvasElement.height=this.yy2;
    let background=new Image();
    background.src='assets/foto.jpg';
    this.ctx=this.canvasElement.getContext('2d');
    
    background.onload=()=>{
      this.ctx.drawImage(background,0,0,this.xx2,this.yy2);
      
    };

  }
  ponerect(){
    this.ctx.rect(this.xx1,this.yy1,this.xx2,this.yy2);
    this.ctx.lineWidth=1;
    this.ctx.strokeStyle='#ffcccc';
    this.ctx.stroke();
  }
}
