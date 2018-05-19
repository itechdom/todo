import {extendObservable, observable, computed, autorun, action, reaction, toJS} from 'mobx';
import {getScreenshotList, createAlbum, loadAlbums, loadDeletedAlbum, removeAssetFromAlbum, addAssetToAlbum, getAlbumAssets} from './PhotoIOS.js';
import {FOLDER_IDENTIFIER, DELETED_KEY} from '../Constants';
import {AsyncStorage} from 'react-native';
import uuidV4 from 'uuid/v4';

export class ScreenshotOrganizer {

  constructor() {
    extendObservable(this, {
      itemsPerPage:10,
      page:0,
      canLoadMore:true,
      originalScreenshotList:[],
      screenshotList : [],
      previewedImage:{},
      folderList:[],
      modalVisible:false,
      photoPreviewOpen:false,
      screenshotAlbum:{},
      deletedScreenshotList:[],
      mediaList:computed(()=>{
        return this.screenshotList.slice();
      }),
      init:action(async ()=>{
        let deletedScreenshotList = await this.getDeletedScreenshots();
        this.deletedScreenshotList.push(...deletedScreenshotList);
      }),
      selectScreenshot:action((media,index,selected)=>{
        this.screenshotList[index].selected = selected;
      }),
      saveOriginalScreenshotList:action((screenshotList)=>{
        if(this.originalScreenshotList.length === 0){
          this.originalScreenshotList = screenshotList;
        }
      }),
      processScreenshotList:action((screenshotList)=>{
        return screenshotList.map((screenshot)=>{
          return new Screenshot(screenshot.image,false,screenshot);
        }).map((screenshot)=>{
          let deleted = this.deletedScreenshotList.find((localIdentifier)=>{return localIdentifier === screenshot.asset.localIdentifier});
          screenshot.deleted = !!deleted;
          return screenshot;
        });
      }),
      getNextPhotoListIOS:action(()=>{
        this.page++;
        let startIndex =  this.page * this.itemsPerPage;
        let endIndex = ((this.page+1)*this.itemsPerPage) - 1;
        getScreenshotList(startIndex, endIndex, (response)=>{
          console.log("FETCHING NEXT ...",response);
          let screenshotList = this.processScreenshotList(response);
          console.log("screenshotList next",screenshotList);
          this.screenshotList.push(...screenshotList);
        });
      }),
      getPhotoListIOS:action(()=>{
        let startIndex = this.page * this.itemsPerPage;
        let endIndex = ((this.page+1)*this.itemsPerPage) - 1;
        getScreenshotList(startIndex, endIndex, (response)=>{
          console.log("FETCHING MORE ...",response);
          let screenshotList = this.processScreenshotList(response);
          this.screenshotList.push(...screenshotList);
        },(update)=>{
          update(this.screenshotList.map(screenshot=>screenshot.asset), (response) => {
            let screenshotList = this.processScreenshotList(response);
            this.screenshotList.clear();
            this.screenshotList.push(...screenshotList);
          },
          //If RNPF needs to retrive more assets to complete the change,
          //eg. a move happened that moved a previous out of array-index asset into your corrently loaded assets.
          //Here you can apply a param obj for options on how to load those assets. eg. ´includeMetadata : true´.
          {
            includeMetadata : true
          });
        },()=>{
          //this is full reload
        },(album)=>{
          //this the album
          this.screenshotAlbum = album;
        });
      }),
      toggleModalVisible:action(()=>{
        this.modalVisible = !this.modalVisible;
      }),
      addFolder:action((folderTitle)=>{
        createAlbum(folderTitle+FOLDER_IDENTIFIER).then((album)=>{
          this.folderList.push(new Folder(folderTitle,album))
        });
      }),
      deleteFolder:action((folderTitle)=>{
        //delete folder
      }),
      addScreenshotListToFolder:action((folderTitle)=>{
        let selectedFolder = this.folderList.find((f)=>{
          return folderTitle === f.title;
        });
        selectedFolder.screenshotList.clear();
        let selectedPhotos = this.screenshotList.filter(screenshot=>screenshot.selected);
        selectedPhotos.map((screenshot)=>{addAssetToAlbum(screenshot.asset,selectedFolder.album)});
        selectedPhotos.map((screenshot)=>{this.deleteScreenshot(screenshot)});
        selectedFolder.screenshotList.push(...selectedPhotos.slice());
      }),
      deleteScreenshot:action(async (screenshot)=>{
        screenshot.deleted = true;
        screenshot.selected = false;
        let deleted = await this.saveDeletedScreenshot(screenshot);
      }),
      getFolderList:action(()=>{
        loadAlbums().then((albums)=>{
          let folderList = albums.map((album)=>new Folder(album.title.replace(FOLDER_IDENTIFIER,""),album));
          this.folderList.push(...folderList);
          folderList.map((folder)=>{
            if(folder.album.previewAsset){
              folder.thumbnail = folder.album.previewAsset.image;
            }
            this.getFolderDetails(folder);
          })
        });
      }),
      getFolderDetails:action((folder)=>{
        folder.screenshotList.clear();
        getAlbumAssets(folder.album).then(assets=>assets.map((asset)=>{
          let screenshot = new Screenshot(asset.image,false,asset);
          folder.screenshotList.push(screenshot);
        })
      );
    }),
    getDeletedScreenshots:action(async () => {
      try {
        const value = await AsyncStorage.getAllKeys();
        if (value !== null){
          return value
        }
        else{
          return [];
        }
      } catch (error) {
        // Error retrieving data
      }
    }),
    saveDeletedScreenshot:action(async (screenshot) => {
      try {
        let deleted = await AsyncStorage.setItem(screenshot.asset.localIdentifier, JSON.stringify(screenshot));
      } catch (error) {
        // Error saving data
        console.log("ERROR setting deleted");
      }
    })
  })
}
}

export class Folder{
  id;
  title;
  album;
  thumbnail;
  constructor(title,album){
    this.album = album;
    extendObservable(this, {
      title:title,
      screenshotList:[],
      thumbnail:undefined
    });
  }
}

export class Screenshot{
  id;
  photo = '';
  selected = false;
  asset;
  deleted;
  folder;
  constructor(photo,selected,asset){
    this.asset = asset;
    this.deleted = false;
    extendObservable(this, {
      photo:photo,
      selected:selected
    });
  }
}
