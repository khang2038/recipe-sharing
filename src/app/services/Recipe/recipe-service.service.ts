import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RecipeServiceService {
  private baseUrl = 'http://localhost:5454';

  constructor(private http: HttpClient) {}

  recipeSubject = new BehaviorSubject<any>({
    recipes: [],
    loading: false,
    newRecipe: null,
  });

  private getHeader(): HttpHeaders {
    const token = localStorage.getItem('jwt');
    return new HttpHeaders({
      Authorization: `Bearer ${localStorage.getItem('jwt')}`,
    });
  }

  getRecipes(): Observable<any> {
    const headers = this.getHeader();
    return this.http.get(`${this.baseUrl}/api/recipe`, { headers }).pipe(
      tap((recipes) => {
        const currentState = this.recipeSubject.value;
        this.recipeSubject.next({ ...currentState, recipes });
      })
    );
  }

  createRecipes(recipe: any): Observable<any> {
    const headers = this.getHeader();
    return this.http
      .post(`${this.baseUrl}/api/recipe`, recipe, { headers })
      .pipe(
        tap((newRecipes) => {
          const currentState = this.recipeSubject.value;
          this.recipeSubject.next({
            ...currentState,
            recipes: [newRecipes, ...currentState.recipes],
          });
        })
      );
  }

  updateRecipes(recipe: any): Observable<any> {
    const headers = this.getHeader();
    return this.http
      .post(`${this.baseUrl}/api/recipe/${recipe.id}`, recipe, { headers })
      .pipe(
        tap((updatedRecipe: any) => {
          const currentState = this.recipeSubject.value;
          const updatedRecipes = currentState.recipes.map((item: any) =>
            item.id === updatedRecipe.id ? updatedRecipe : item
          );
          this.recipeSubject.next({
            ...currentState,
            recipes: updatedRecipes,
          });
        })
      );
  }

  deleteRecipes(recipe: any): Observable<any> {
    const headers = this.getHeader();
    return this.http
      .post(`${this.baseUrl}/api/recipe/${recipe.id}`, recipe, { headers })
      .pipe(
        tap((updatedRecipe: any) => {
          const currentState = this.recipeSubject.value;
          const updatedRecipes = currentState.recipes.map((item: any) =>
            item.id === updatedRecipe.id ? updatedRecipe : item
          );
          this.recipeSubject.next({
            ...currentState,
            recipes: updatedRecipes,
          });
        })
      );
  }
}
