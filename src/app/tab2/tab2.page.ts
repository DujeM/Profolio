import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {
  searchText: string;
  character: any;
  constructor(
    private http: HttpClient
  ) {}

  searchCharacter(name: string) {
    this.http.get(`https://eu.api.blizzard.com/profile/wow/character/draenor/${name}/equipment?namespace=profile-eu&locale=en_GB&access_token=USlI8lFeqCEYRral8SqmxPQQ36UFeiZdhx`)
    .subscribe(result => {
      this.character = result;
      console.log(this.character)
    });
  }

}
