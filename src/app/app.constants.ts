import { Injectable } from '@angular/core';
import { environment } from '../environments/environment'

@Injectable({
  providedIn: 'root',
})

export class AppConstants {
  constructor() { }

  //JOB service
  public static API_BASE_URL: string = environment.apiBaseUrl;
  public static JOB_BASE_URL : string = AppConstants.API_BASE_URL + '/jobs';
  public static TASK_URL : string = '/tasks';
  public static STATUS_BASE_URL : string = AppConstants.API_BASE_URL + '/status';
  public static FILES_URL: string = '/files';

  //CAR service
  public static MAKES_URL : string = AppConstants.API_BASE_URL + '/makes'
  public static MODELS_URL : string = '/models';
  public static CAR_URL : string = AppConstants.API_BASE_URL + '/cars'
  public static VIN_URL : string = '/vin';

  //USER service
  public static USERS_URL : string = AppConstants.API_BASE_URL + '/users'
  public static EMAIL_PARAM : string = '?email=';
  public static LOG_INS_URL : string = '/logIns';
  public static ROLES_URL : string = '/roles';

  //CAR IMAGERY
  public static CAR_IMAGERY_URL: string = 'http://www.carimagery.com/api.asmx/GetImageUrl?searchTerm=';

  //VIN DECODER
  public static VIN_BASE_URL:string = 'http://api.marketcheck.com/v1/vin/';
  public static API_KEY_PARAM:string = '/specs?api_key=HbGqDWr0neAcdWICnHuhAmJvAAExomA1';
}