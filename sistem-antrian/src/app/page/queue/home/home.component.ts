import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";

import { ApiService } from "src/app/service";

import { ActivatedRoute, Router } from "@angular/router";
import { Config } from "src/app/guard";
@Component({
    selector: "app-home",
    templateUrl: "./home.component.html",
    styleUrls: ["./home.component.scss"],
})
export class HomeComponent implements OnInit {
    poli: any;
    farmasi: any;
    showPoli: boolean;
    listPoli: any;
    listFarmasi: any;
    namaProfile = Config.getProfile().namaProfile;
    constructor(private apiService: ApiService, private route: Router) {}

    ngOnInit(): void {
        this.apiService.get("viewer/get-setting-viewer").subscribe((e) => {
            this.listPoli = e.ruangan;
            this.listFarmasi = e.farmasi;
            this.poli = [];
            for (let x = 0; x < this.listPoli.length; x++) {
                const element = this.listPoli[x];
                // if ([698, 662, 688, 693, 694, 676].includes(element.id)) {
                this.poli.push(element);
                // }
            }
            this.farmasi = [];
            for (let x = 0; x < this.listFarmasi.length; x++) {
                const element = this.listFarmasi[x];
                // if ([698, 662, 688, 693, 694, 676].includes(element.id)) {
                this.farmasi.push(element);
                // }
            }
        });
    }
    save(e) {
        if (e == undefined) return;
        let data = "";
        for (let x = 0; x < e.length; x++) {
            const element = e[x];
            data = data + "," + element.id;
        }

        data = data.substring(1, data.length);
        this.route.navigate(["/viewer-poli/" + data]);
    }

    saveFarma(e) {
        if (e == undefined) return;
        let data = "";
        for (let x = 0; x < e.length; x++) {
            const element = e[x];
            data = data + "," + element.id;
        }

        data = data.substring(1, data.length);
        this.route.navigate(["/viewer-farmasi/" + data]);
    }
}
