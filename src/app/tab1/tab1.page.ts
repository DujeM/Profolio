import { Component } from '@angular/core';
import { JobService } from '../services/job.service';
import { Job } from '../models/job';
import { ProfolioService } from '../services/profolio.service';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {
  loading: boolean = true;
  slideOpts = {
    pagination: false,
    slidesPerView: 1.5,
    spaceBetween: 5 
  };
  newJobs: any[] = [];
  popularJobs: any[] = [];
  profolios: any[] = [];
  constructor(
    private jobService: JobService,
    private profolioService: ProfolioService
  ) {}

  ionViewWillEnter() {
    this.getProfolios();
    this.getNewJobs();
    this.getPopularJobs();
  }

  getProfolios() {
    this.profolios = [];
    this.profolioService.getProfoliosForExploreTab().then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        this.profolios.push({id: doc.id, ...doc.data()});
      })
      console.log(this.profolios)
    })
  }

  getNewJobs() {
    this.newJobs = [];
    this.jobService.getNewJobsForExploreTab().then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        this.newJobs.push({id: doc.id, ...doc.data()});
      })
      console.log(this.newJobs)
    })
  }

  getPopularJobs() {
    this.popularJobs = [];
    this.jobService.getPopularJobsForExploreTab().then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        this.popularJobs.push({id: doc.id, ...doc.data()});
      })
      console.log(this.popularJobs)
      setTimeout(() => {
        this.loading = false;
      },500);
    })
  }
}
