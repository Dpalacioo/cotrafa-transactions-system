import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { User } from '../../shared/models';

interface RandomUserResponse {
  results: Array<{
    login: { uuid: string };
    name: { first: string; last: string };
    email: string;
    location: { city: string; country: string };
    phone: string;
    picture: { thumbnail: string; medium: string; large: string };
  }>;
}

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  private readonly apiUrl = 'https://randomuser.me/api/';

  constructor(private http: HttpClient) {}

  getUsers(limit = 100): Observable<User[]> {
    return this.http
      .get<RandomUserResponse>(`${this.apiUrl}?results=${limit}`)
      .pipe(
        map((response) =>
          response.results.map((user) => ({
            id: user.login.uuid,
            name: `${user.name.first} ${user.name.last}`,
            email: user.email,
            city: user.location.city,
            country: user.location.country,
            phone: user.phone,
            picture: user.picture.thumbnail,
          }))
        )
      );
  }
}
