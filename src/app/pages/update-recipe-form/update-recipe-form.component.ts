import { Component, Inject, OnInit } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatRadioModule } from '@angular/material/radio';
import { RecipeServiceService } from '../../services/Recipe/recipe-service.service';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-update-recipe-form',
  standalone: true,
  imports: [
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatRadioModule,
  ],
  templateUrl: './update-recipe-form.component.html',
  styleUrl: './update-recipe-form.component.scss',
})
export class UpdateRecipeFormComponent implements OnInit {
  public recipeItem: any;

  constructor(
    @Inject(MAT_DIALOG_DATA) public recipe: any,
    private recipeService: RecipeServiceService
  ) {}

  ngOnInit() {
    this.recipeItem = this.recipe;
  }

  onSubmit() {
    this.recipeService.updateRecipes(this.recipeItem).subscribe(
      (response) => {
        console.log('Recipe updated successfully:', response);
      },
      (error) => {
        console.error('Error updating recipe:', error);
      }
    );
  }
}
