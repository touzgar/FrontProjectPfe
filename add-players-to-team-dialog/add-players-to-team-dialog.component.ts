import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-add-players-to-team-dialog',
  templateUrl: './add-players-to-team-dialog.component.html'
  })
export class AddPlayersToTeamDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<AddPlayersToTeamDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onAddClick(): void {
    // Assuming data contains { teamName: '', coachName: '' }
    if (this.data.teamName && this.data.playerNames) {
      // Data is valid
      this.dialogRef.close(this.data);
    }
  }


}
