import { Component, Inject, Optional, ViewChild, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { MatTableDataSource, MatTable } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DatePipe } from '@angular/common';
import { AppAddTeamComponent } from './add/add.component';
import { Team } from './team.model';
import { ActivatedRoute, Router } from '@angular/router';
import { TeamService } from './team.service';
import { AddCoachToTeamDialogComponent } from './add-coach-to-team-dialog/add-coach-to-team-dialog.component';
import { RemoveCoachFromTeamDialogComponent } from './remove-coach-from-team-dialog/remove-coach-from-team-dialog.component';
import { AddPlayersToTeamDialogComponent } from './add-players-to-team-dialog/add-players-to-team-dialog.component';
import { RemovePlayersFromTeamDialogComponent } from './remove-players-from-team-dialog/remove-players-from-team-dialog.component';




@Component({
  templateUrl: './team.component.html',
})
export class AppTeamComponent implements AfterViewInit {
  team:Team[];
  currentTeam = new Team();
  equipe:Team=new Team();
  titleTeam!:string;
  allTeam!:Team[];
  searchTerm!:string;

  @ViewChild(MatTable, { static: true }) table: MatTable<any> = Object.create(null);
  searchText: any;
  displayedColumns: string[] = [
    'TeamId',
    'teamName',
    'description',
    'dateCreation',
    'coachName',
    'playerName',
    'action'
  ];
  dataSource = new MatTableDataSource<Team>([]);
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator = Object.create(null);

  constructor(public dialog: MatDialog, public datePipe: DatePipe,private teamService:TeamService, 
    private changeDetectorRefs: ChangeDetectorRef,private router:Router, private activateRoute: ActivatedRoute) { }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.chargerTeam();
  }

  applyFilter(filterValue: string): void {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  openDialog(action: string, obj: any): void {
    obj.action = action;
    const dialogRef = this.dialog.open(AppTeamDialogContentComponent, {
      data: obj,
    });
    dialogRef.afterClosed().subscribe((result) => {
      // Check if result is defined and has the property 'event'
      if (result?.event) {
        if (result.event === 'Add') {
          this.addTeam(result.data);
          this.addRowData(result.data);
        } else if (result.event === 'Update') {
          this.modifierTeam(result.data);
          this.updateRowData(result.data);
        } else if (result.event === 'Delete') {
          this.deleteTeam(result.data);
          this.deleteRowData(result.data);
        }
      } else {
        // Handle the case where result is undefined or doesn't have the event property
        console.log('Dialog was closed without an action');
      }
    });
    
  }

  openAddCoachDialog(): void {
    const dialogRef = this.dialog.open(AddCoachToTeamDialogComponent, {
      width: '600px',
      data: { teamName: '', coachName: '' }
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Ensure you're passing the correct parameters to the service method
        this.addCoachToTeam(result.teamName, result.coachName);
      }
    });
  }
    
  openRemoveCoachDialog(): void {
    const dialogRef = this.dialog.open(RemoveCoachFromTeamDialogComponent, {
      width: '600px',
      data: { teamName: '', coachName: '' }
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Ensure you're passing the correct parameters to the service method
        this.removeCoachToTeam(result.teamName, result.coachName);
      }
    });
  }
  openAddPlayersDialog(): void {
    const dialogRef = this.dialog.open(AddPlayersToTeamDialogComponent, {
      width: '600px',
      data: { teamName: '', playerNames: '' }
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Ensure you're passing the correct parameters to the service method
        this.addPlayersToTeam(result.teamName, result.playerNames);
      }
    });
  }
 
  openRemovePlayersDialog(): void {
    const dialogRef = this.dialog.open(RemovePlayersFromTeamDialogComponent, {
      width: '600px',
      data: { teamName: '', playerNames: '' } 
       });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result && result.teamName && Array.isArray(result.playerNames)) {
        // Ensure you're passing the correct parameters to the service method
        this.removePlayerFromTeam(result.teamName, result.playerNames);
      }
    });
  }
 
    




  chargerTeam() {
   // Example log in your Angular service after fetching teams
this.teamService.listeTeam().subscribe(teams => {
  console.log('Teams received:', teams); // Check the structure here
  this.team = teams;
  this.dataSource.data = this.team;
  this.changeDetectorRefs.detectChanges();
});

  }
  addTeam(team: Team) {
    this.teamService.addTeam(team).subscribe({
      next: (newTeam) => {
        console.log("Team added successfully", newTeam);
        this.chargerTeam(); // Refresh the list
      },
      error: (error) => {
        console.error("Error adding team", error);
      }
    });
  }

  deleteTeam(team:Team){
    this.teamService.supprimerTeam(team.idTeam!).subscribe(() => {
      console.log('Team supprimé');
      this.chargerTeam();
   });
  }
  modifierTeam(team: Team): void {
    this.teamService.updateTeam(team).subscribe(() => {
      console.log('Team updated successfully');
      this.chargerTeam(); // Refresh the list
    }, error => {
      console.error('Error updating club', error);
    });
  }
  searchTeams(event: Event) {
    const inputElement = event.target as HTMLInputElement; // Cast to HTMLInputElement
    const searchTerm = inputElement.value; // Now you can safely access .value
    if (searchTerm) {
      this.teamService.rechercheParNameTeam(searchTerm).subscribe(teams => {
        this.dataSource.data = teams;
      });
    } else {
      this.chargerTeam();
    }
  }
  
  
  onkeyUp(filterText:string){
    this.team=this.allTeam.filter(item=>item.teamName.toLowerCase().includes(filterText));
  }

  addCoachToTeam(teamName: string, coachName: string) {
    // In your component where you're calling addCoachToTeam
this.teamService.addCoachToTeam(teamName, coachName).subscribe({
  next: (response) => {
    console.log("Coach added successfully", response);
    this.chargerTeam();
    // Additional success handling
  },
  error: (error) => {
    console.error("Error adding coach to team", error);
    // Additional error handling
  }
});

  }
   addPlayersToTeam(teamName: string, playerNames: string) {
//     // In your component where you're calling addCoachToTeam
const playerNamesArray = playerNames.split(',').map(name => name.trim()); // Adjust the delimiter if necessary
this.teamService.addPlayersToTeam(teamName, playerNamesArray).subscribe({
  next: (response) => {
    console.log("Player added successfully", response);
    this.chargerTeam();
  },
  error: (error) => {
    console.error("Error adding player to team", error);
  }
});

  }
  removeCoachToTeam(teamName: string, coachName: string) {
    // In your component where you're calling addCoachToTeam
    this.teamService.removeCoachFromTeam(teamName, coachName).subscribe({
      next: (message) => {
        console.log(message); // Should log 'Coach removed successfully'
        this.chargerTeam(); // Refresh the list if needed
      },
      error: (error) => {
        console.error("Error removing coach from team", error);
      }
    });
  }  
  removePlayerFromTeam(teamName: string, playerNames: string[]): void {
    this.teamService.removePlayersFromTeam(teamName, playerNames).subscribe({
      next: (response) => {
        console.log("Players removed successfully", response);
        this.chargerTeam();
        // Refresh your team or players list here if necessary
      },
      error: (error) => {
        console.error("Error removing players from team", error);
      }
    });
  } 

  
  getCoachNamesForTeam(team: Team): string {
    // Make sure to check if 'coaches' is not undefined or null
    return team.coaches?.map(c => c.nameCoach).join(', ') || 'No Coaches';
}
  getPlayerNamesForTeam(team: Team): string {
    // Make sure to check if 'coaches' is not undefined or null
    return team.players?.map(c => c.leagalefullname).join(', ') || 'No Players';
}

  
  
  
  
  
  
  

  // tslint:disable-next-line - Disables all
  addRowData(row_obj: Team): void {
    this.dialog.open(AppAddTeamComponent);
    this.table.renderRows();
  }

  // tslint:disable-next-line - Disables all
  updateRowData(row_obj: Team): boolean | any {
  }

  // tslint:disable-next-line - Disables all
  deleteRowData(row_obj: Team): boolean | any {
   }
}

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'app-dialog-content',
  templateUrl: 'team-dialog-content.html',
})
// tslint:disable-next-line: component-class-suffix
export class AppTeamDialogContentComponent {
  action: string;
  // tslint:disable-next-line - Disables all
  local_data: any;
  selectedImage: any = '';
  joiningDate: any = '';

  constructor(
    public datePipe: DatePipe,
    public dialogRef: MatDialogRef<AppTeamDialogContentComponent>,
    // @Optional() is used to prevent error if no data is passed
    @Optional() @Inject(MAT_DIALOG_DATA) public data: Team,
  ) {
    this.local_data = { ...data };
    this.action = this.local_data.action;
    if (this.local_data.DateOfJoining !== undefined) {
      this.joiningDate = this.datePipe.transform(
        new Date(this.local_data.DateOfJoining),
        'yyyy-MM-dd',
      );
    }
    if (this.local_data.imagePath === undefined) {
      this.local_data.imagePath = 'assets/images/profile/user-1.jpg';
    }
  }

  doAction(): void {
    this.dialogRef.close({ event: this.action, data: this.local_data });
  }
  closeDialog(): void {
    this.dialogRef.close({ event: 'Cancel' });
  }

  selectFile(event: any): void {
    if (!event.target.files[0] || event.target.files[0].length === 0) {
      // this.msg = 'You must select an image';
      return;
    }
    const mimeType = event.target.files[0].type;
    if (mimeType.match(/image\/*/) == null) {
      // this.msg = "Only images are supported";
      return;
    }
    // tslint:disable-next-line - Disables all
    const reader = new FileReader();
    reader.readAsDataURL(event.target.files[0]);
    // tslint:disable-next-line - Disables all
    reader.onload = (_event) => {
      // tslint:disable-next-line - Disables all
      this.local_data.imagePath = reader.result;
    };
  }
}
