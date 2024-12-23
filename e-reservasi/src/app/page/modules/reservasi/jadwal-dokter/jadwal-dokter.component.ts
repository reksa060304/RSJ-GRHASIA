import { Component, OnInit, ViewChild, OnDestroy, Injectable } from '@angular/core';
import { DropdownModule, SelectItem, InplaceModule, MenuItem, ConfirmationService } from 'primeng/primeng';
import {
    HttpClient,
    UserDto,
    Authentication,
    AuthGuard,
    AlertService,
    InfoService,
    Configuration,
    CacheService
  } from '../../../../helper';

  @Component({
    selector: 'jadwal-dokter',
    templateUrl: './jadwal-dokter.component.html',
    styleUrls: ['./jadwal-dokter.component.scss']
  })
  export class JadwalDokterComponent implements OnInit {
    dataSourceJadwal: any[];
    item : any={
      status: true
    };
    
    
    
    

    constructor(private Backend : HttpClient,
                private cacheService : CacheService,
                
                
                ){
                   

    }
    ngOnInit(): void {
        this.loadData()
    } 
    loadData(){
      let id =''
      if (this.item.idKms  !=undefined) {
        id="id="+this.item.idKms
      }
      let namaruangan =''
      if (this.item.namaruangan  !=undefined) {
        namaruangan="search="+this.item.namaruangan
      }
      console.log(namaruangan);
      this.Backend.get('medifirst2000/api/get-jadwal-dokter?'+namaruangan)
      .subscribe(e =>{
          this.dataSourceJadwal = e.data
      })
    
    }

    tambahData(){
      
    }
    hapushData(){
      
    }
    klikdata(data){
      
    }
    openDialog(){

    }
    
  }