
export class Axie {
  banned: boolean = false;  //{banned: false, __typename: 'AxieBattleInfo'}
  breedCount: number = 0;
  class: string = "";
  id: string = "";
  image: string = "";
  name: string = "";
  parts: any[] = [];
  abilities: any[] = [];
  stage: number = 0;
  title: string = "";
  stats: any;
  traits?: any;
  teamId?: string;
  cssContainerClass: string = "";
  constructor(values: Object = {}) {
    Object.assign(this, values);
    if(this.image === ''){
      this.generateImage();
    }
  }
  generateImage(){
    this.image = `https://storage.googleapis.com/assets.axieinfinity.com/axies/${this.id}/axie/axie-full-transparent.png`;
  }
  getValues() {
    const values: any = this.getValuesMin();
    values.banned = this.banned;
    values.image = this.image;
    values.parts = this.parts;
    values.abilities = this.abilities;
    values.stage = this.stage;    
    return values
  }
  getValuesMin(){
    return {
      breedCount: this.breedCount,
      class: this.class,
      id: this.id,
      name: this.name,
      title: this.title,
    }
  }
}
