import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-remove-players-from-team-dialog',
  templateUrl: './remove-players-from-team-dialog.component.html',
  styleUrls: ['./remove-players-from-team-dialog.component.scss'] // Note the correction in property name from styleUrl to styleUrls
})
export class RemovePlayersFromTeamDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<RemovePlayersFromTeamDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onRemoveClick(): void {
    // Convert playerNames to an array if it's a string
    let playerNamesArray: string[] = [];
    if (typeof this.data.playerNames === 'string') {
      playerNamesArray = this.data.playerNames.split(',').map((name: string) => name.trim()); // Added type annotation
    } else if (Array.isArray(this.data.playerNames)) {
      playerNamesArray = this.data.playerNames;
    }

    if (this.data.teamName && playerNamesArray.length > 0) {
      this.dialogRef.close({
        teamName: this.data.teamName,
        playerNames: playerNamesArray,
      });
    }
  }
}
