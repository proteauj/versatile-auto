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
  public static JOB_TASK_URL : string = AppConstants.JOB_BASE_URL + AppConstants.TASK_URL;
  public static STATUS_BASE_URL : string = AppConstants.API_BASE_URL + '/status';
  public static STATUS_PARAM : string = '?status=';
  public static FILES_URL: string = '/files';

  //CAR service
  public static MAKES_URL : string = AppConstants.API_BASE_URL + '/makes';
  public static MODELS_URL : string = '/models';
  public static CAR_URL : string = AppConstants.API_BASE_URL + '/cars';
  public static VIN_URL : string = '/vin';

  //CLIENT service
  public static CLIENTS_URL : string = '/clients';
  public static CLIENTS_BASE_URL : string = AppConstants.API_BASE_URL + AppConstants.CLIENTS_URL;

  //USER service
  public static USERS_URL : string = AppConstants.API_BASE_URL + '/users';
  public static EMAIL_PARAM : string = '?email=';
  public static LOG_INS_URL : string = '/logIns';
  public static ROLES_URL : string = '/roles';

  //JOB-INSPECT service
  public static TASKS_URL : string = AppConstants.API_BASE_URL + '/tasks';
  public static CAR_AREA_ONLY_PARAM : string = '?carAreaOnly=';
  public static CAR_AREAS_URL : string = AppConstants.API_BASE_URL + '/car-areas';

  //TASK-ACTIVITY service
  public static ACTIVITY_URL : string = '/activities';
  public static JOB_TASK_ACTIVITY_URL : string = AppConstants.JOB_TASK_URL + AppConstants.ACTIVITY_URL;
  public static TASK_ACTIVITY_URL : string = AppConstants.TASK_URL + AppConstants.ACTIVITY_URL;

  //CAR IMAGERY
  public static CAR_IMAGERY_URL: string = 'https://www.carimagery.com/api.asmx/GetImageUrl?searchTerm=';

  //VIN DECODER
  public static VIN_BASE_URL:string = 'http://api.marketcheck.com/v1/vin/';
  public static API_KEY_PARAM:string = '/specs?api_key=HbGqDWr0neAcdWICnHuhAmJvAAExomA1';
}
