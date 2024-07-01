import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RecipeServiceService {
  private baseUrl = 'http://localhost:9090';

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

  deleteRecipes(id: any): Observable<any> {
    const headers = this.getHeader();
    return this.http
      .delete(`${this.baseUrl}/api/recipe/${id}`, {
        headers,
        responseType: 'text',
      })
      .pipe(
        tap((response: string) => {
          console.log(response);
          const currentState = this.recipeSubject.value;
          const updatedRecipes = currentState.recipes.filter(
            (item: any) => item.id !== id
          );
          this.recipeSubject.next({
            ...currentState,
            recipes: updatedRecipes,
          });
        })
      );
  }

  likeRecipes(id: any): Observable<any> {
    const headers = this.getHeader();
    return this.http
      .post(`${this.baseUrl}/api/recipe/${id}/like`, { headers })
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
