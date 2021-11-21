import { Injectable } from '@angular/core';
import { arrayRemove, doc, Firestore } from '@angular/fire/firestore';
import { addDoc, arrayUnion, collection, deleteDoc, DocumentReference, getDoc, getDocs, query, QueryDocumentSnapshot, updateDoc, where } from '@firebase/firestore';
import { Observable, from, Subject } from 'rxjs';
import { community, communityPost, communityRequest } from '../models/interfaces';
import { DatabaseService } from '../services/database/database.service';

@Injectable({
  providedIn: 'root'
})
export class ComunityService {
  activeCommunity!: community;  
  activeUpdate$: Subject<community> = new Subject();
  constructor(
    private db: Firestore,
    private apiTracker: DatabaseService
  ) { }

  
  async addScholarToComunity(roninAddress: string, comunityId: string) {
    const querySnapshot = await getDocs(query(collection(this.db, "scholar-communities"), where('community', "==", comunityId)));
    const docRef: DocumentReference = querySnapshot.docs[0].ref;
    if (docRef) {
      await updateDoc(docRef, {
        members: arrayUnion(roninAddress)
      })
    }
    return docRef.id
  }
  async addCommunity(form: {
    name: string,
    admin: string,
    discord: string,
    type: string,
    rankType: string
  }):Promise<community> {
    const newCommunity: any = form;
    const docRef: DocumentReference = await addDoc(collection(this.db, "communities"), newCommunity);
    await addDoc(collection(this.db, "scholar-communities"), {
      members: [form.admin],
      community: docRef.id
    });
    newCommunity.id = docRef.id;
    return newCommunity;
  }
  async deleteCommunity(communityId: string){
    await deleteDoc(doc(this.db, "communities", communityId));
    return communityId;
  }
  async communityExists(name: string) {
    const querySnapshot = await this.getCommunitiesByName(name).toPromise();
    return !!querySnapshot.docs[0];
  }
  async getCommunities(roninAddress: string) {
    const querySnapshot = await getDocs(query(collection(this.db, "scholar-communities"), where('members', "array-contains", roninAddress)));
    let communities = await Promise.all(querySnapshot.docs.map(async (doc) => {
      return this.getCommunityAllData(doc.data().community);
    }))
    return communities || [];
  }
  getCommunitiesByName(partialName: string): Observable<any> {
    return from(getDocs(query(collection(this.db, "communities"), where('name', '==', partialName))));
  }
  getCommunitiesByPartialName(partialName: string): Observable<any> {
    return from(getDocs(query(collection(this.db, "communities"), where('name', '>=', partialName), where('name', '<=', partialName + '\uf8ff'))));
  }
  async getCommunityAllData(id: string): Promise<community> {
    const docRef = doc(this.db, 'communities', id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const data = docSnap.data();
      return {
        name: data.name,
        type: data.type,
        id: docSnap.id,
        rankType: data.rankType,
        admin: data.admin
      };
    } else {
      return  {
        name: '',
        type: '',
        id: '',
        rankType: '',
        admin: ''
      };
    }
  }
  async addCommunityPost(msg: communityPost) {
    const docRef: DocumentReference = await addDoc(collection(this.db, "community-post"), msg);
    return docRef.id;
  }
  async createCommunityRequest(from: string, fromName: string, communityId: string) {
    const reqDoc = await this.getRequest(from, communityId)
    if (reqDoc) {
      return reqDoc.id;
    } else {
      const dbRef = await addDoc(collection(this.db, "community-request"), {
        "from": from,
        "fromName": fromName,
        "communityId": communityId
      });
      const doc = await getDoc(dbRef);
      return doc.id;
    }
  }
  async getRequest(from: string, communityId: string) {
    const querySnapshot = await getDocs(query(collection(this.db, "community-request"), where('from', '==', from), where('communityId', '==', communityId)))
    return querySnapshot.docs[0];
  }
  async acceptRequest(solicitud: communityRequest) {
    const docId = await this.addScholarToComunity(solicitud.from, solicitud.communityId);
    await deleteDoc(doc(this.db, "community-request", solicitud.id));
    return docId;
  }
  async rejectRequest(solicitud: communityRequest) {
    await deleteDoc(doc(this.db, "community-request", solicitud.id));
  }
  async getRequests(communityId: string): Promise<communityRequest[]> {
    const querySnapshot = await getDocs(query(collection(this.db, "community-request"), where('communityId', "==", communityId)));
    const requestList = querySnapshot.docs.map((doc: QueryDocumentSnapshot) => {
      const data = doc.data();
      return {
        from: data.from,
        communityId: data.communityId,
        id: doc.id,
        fromName: data.fromName
      }
    })
    return requestList;
  }
  async kick(roninAddress: string, communityId:string) {
    const querySnapshot = await getDocs(query(collection(this.db, "scholar-communities"), where('community', "==", communityId)));
    const docRef: DocumentReference = querySnapshot.docs[0].ref;
    if (docRef) {
      await updateDoc(docRef, {
        members: arrayRemove(roninAddress)
      })
    }
    return docRef.id
  }
  async updateCommunity(communityId:string, form: {
    name: string,
    discord: string,
    type: string,
    rankType: string
  }){
    const docRef = doc(this.db, 'communities', communityId);
    await updateDoc(docRef, form);    
    const docSnap = await getDoc(docRef);
    const data = docSnap.data();
    return {
      name: data!.name,
      type: data!.type,
      id: docSnap.id,
      rankType: data!.rankType,
      admin: data!.admin,
      discord: data!.discord
    };
  }
  
  async buildCommunity(community:community){
    community.members = await this.getMembers(community);
    community.rank = await this.buildRank(community);
    community.solicitudes = await this.getRequests(community.id);
    return community;
  }
  async getMembers(community:community){
    const membersAddressList = await this.getMembersAddressList(community.id);    
    const members = await Promise.all(membersAddressList.map((roninAddress: string)=>{
      return this.apiTracker.getScholar('roninAddress', roninAddress);
    }));
    members.sort((a: any,b: any)=>{
      return b[community.rankType] - a[community.rankType]
    });
    return members;    
  }
  async getMembersAddressList(communityId: string): Promise<string[]> {
    const querySnapshot = await getDocs(query(collection(this.db, "scholar-communities"), where('community', "==", communityId)));
    const docRef = querySnapshot.docs[0];
    if (docRef) {
      return docRef.data().members;
    } else {
      return [];
    }
  }
  async buildRank(community: community){
    community.members!.sort((a: any,b: any)=>{
      return b[community.rankType] - a[community.rankType]
    });
    let rank: any = {};
    rank.firstPlace = await this.apiTracker.createItemList(community.members![0]);
    if(community.members![1]){
      rank.secondPlace = await this.apiTracker.createItemList(community.members![1]);
    }
    if(community.members![2]){
      rank.thirdPlace = await this.apiTracker.createItemList(community.members![2]);
    }
    return rank;
  }
  updateActive(community: community){
    this.activeCommunity.name = community.name;
    this.activeCommunity.type = community.type;
    this.activeCommunity.id = community.id;
    this.activeCommunity.rankType = community.rankType;
  }
}
