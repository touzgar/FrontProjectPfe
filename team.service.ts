import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, throwError } from 'rxjs';
import { AuthServiceService } from '../../authentication/auth-service.service';
import { Team } from './team.model';

@Injectable({
  providedIn: 'root'
})
export class TeamService {
  baseUrl = 'http://localhost:8089/users/api/team';
  team!:Team[];
  constructor(private http: HttpClient,private authService:AuthServiceService) { }
  listeTeam():Observable<Team[]>{
    let jwt=this.authService.getToken();
    jwt="Bearer "+jwt;
    let httpHeaders=new HttpHeaders({"Authorization":jwt});
    return this.http.get<Team[]>(this.baseUrl+"/getAll",{headers:httpHeaders});
  }
  addTeam(team: Team): Observable<Team> {
    let jwt = this.authService.getToken();
    jwt = "Bearer " + jwt;
    let httpHeaders = new HttpHeaders({ "Authorization": jwt });
  
    return this.http.post<Team>(`${this.baseUrl}/add`, team, { headers: httpHeaders });
  }
  
  
  supprimerTeam(id:number){
    const url=`${this.baseUrl}/delete/${id}`;
    let jwt=this.authService.getToken();
    jwt="Bearer "+jwt;
    let httpHeaders=new HttpHeaders({"Authorization":jwt});
  return this.http.delete(url,{headers:httpHeaders});
}
consulterTeam(id:number):Observable<Team>{

  const url = `${this.baseUrl}/update/${id}`;
  let jwt=this.authService.getToken();
  jwt="Bearer "+jwt;
  let httpHeaders=new HttpHeaders({"Authorization":jwt});

  return this.http.get<Team>(url,{headers:httpHeaders});
}
updateTeam(team: Team): Observable<Team> {
  let jwt = this.authService.getToken();
  jwt = "Bearer " + jwt;
  let httpHeaders = new HttpHeaders({ "Authorization": jwt });

  return this.http.put<Team>(`${this.baseUrl}/update/${team.idTeam}`, team, { headers: httpHeaders });
}
rechercheParNameTeam(teamName: string): Observable<Team[]> {
  const url = `${this.baseUrl}/search?name=${teamName}`;
  let jwt = this.authService.getToken();
  let httpHeaders = new HttpHeaders({
    'Authorization': `Bearer ${jwt}`,
    'Content-Type': 'application/json'
  });

  return this.http.get<Team[]>(url, { headers: httpHeaders });
}

addCoachToTeam(teamName: string, coachName: string): Observable<any> {
  let jwt = this.authService.getToken();
  let httpHeaders = new HttpHeaders({
    'Authorization': `Bearer ${jwt}`,
    'Content-Type': 'application/json'
  });

  // Correctly appending query parameters
  const url = `${this.baseUrl}/addCoachToTeam?teamName=${encodeURIComponent(teamName)}&coachName=${encodeURIComponent(coachName)}`;

  return this.http.post(url, {}, { headers: httpHeaders });
}
removeCoachFromTeam(teamName: string, coachName: string): Observable<any> {
  let jwt = this.authService.getToken();
  let httpHeaders = new HttpHeaders({
    'Authorization': `Bearer ${jwt}`
  });

  const url = `${this.baseUrl}/removeCoachFromTeam?teamName=${encodeURIComponent(teamName)}&coachName=${encodeURIComponent(coachName)}`;

  return this.http.delete(url, {
    headers: httpHeaders,
    observe: 'response',
    responseType: 'text' // expect a text response, not JSON
  }).pipe(
    map(response => {
      // If the status is 200 OK, or 204 No Content, handle as success
      if (response.status === 200 || response.status === 204) {
        return 'Coach removed successfully'; // Or whatever response you want to send
      }
      throw response;
    }),
    catchError(error => {
      // Handle actual errors here
      return throwError(() => new Error('An error occurred while removing the coach'));
    })
  );
}

addPlayersToTeam(teamName: string, playerNames: string[]): Observable<any> {
  let jwt = this.authService.getToken();
  let httpHeaders = new HttpHeaders({
    'Authorization': `Bearer ${jwt}`,
    'Content-Type': 'application/json'
  });

  // Correctly appending query parameters
  // Assuming your backend expects a comma-separated list of player names
  const playerNamesParam = encodeURIComponent(playerNames.join(',')); // Adjust based on backend expectation
  const url = `${this.baseUrl}/addPlayersToTeamByNames?teamName=${encodeURIComponent(teamName)}&playerNames=${playerNamesParam}`;

  return this.http.post(url, {}, { headers: httpHeaders });
}

removePlayersFromTeam(teamName: string, playerNames: string[]): Observable<any> {
  const jwt = this.authService.getToken();
  const httpHeaders = new HttpHeaders({
    'Authorization': `Bearer ${jwt}`,
    'Content-Type': 'application/json'
  });

  const params = new HttpParams()
    .set('teamName', teamName)
    .set('playerNames', playerNames.join(',')); // Convert array to comma-separated string

  return this.http.delete(`${this.baseUrl}/removePlayersFromTeamByNames`, { headers: httpHeaders, params });
}



}
