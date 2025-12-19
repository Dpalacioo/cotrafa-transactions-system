import { TestBed } from '@angular/core/testing';
import { UsersService } from './users.service';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { User } from '../../shared/models';

describe('UsersService', () => {
  let service: UsersService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [UsersService],
    });

    service = TestBed.inject(UsersService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify(); // Verifica que no haya solicitudes pendientes
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch users and map to User[]', () => {
    const mockResponse = {
      results: [
        {
          login: { uuid: '123' },
          name: { first: 'John', last: 'Doe' },
          email: 'john.doe@example.com',
          location: { city: 'New York', country: 'USA' },
          phone: '123-456-7890',
          picture: {
            thumbnail: 'thumb.jpg',
            medium: 'med.jpg',
            large: 'large.jpg',
          },
        },
      ],
    };

    const expectedUsers: User[] = [
      {
        id: '123',
        name: 'John Doe',
        email: 'john.doe@example.com',
        city: 'New York',
        country: 'USA',
        phone: '123-456-7890',
        picture: 'thumb.jpg',
      },
    ];

    service.getUsers(1).subscribe((users) => {
      expect(users).toEqual(expectedUsers);
    });

    const req = httpMock.expectOne('https://randomuser.me/api/?results=1');
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse); // Simula la respuesta del servidor
  });

  it('should use default limit of 100 if no parameter is passed', () => {
    const mockResponse = { results: [] };

    service.getUsers().subscribe();

    const req = httpMock.expectOne('https://randomuser.me/api/?results=100');
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should correctly map multiple users', () => {
    const mockResponse = {
      results: [
        {
          login: { uuid: '1' },
          name: { first: 'Alice', last: 'Smith' },
          email: 'alice@example.com',
          location: { city: 'London', country: 'UK' },
          phone: '111-222-333',
          picture: {
            thumbnail: 'alice.jpg',
            medium: 'alice_med.jpg',
            large: 'alice_large.jpg',
          },
        },
        {
          login: { uuid: '2' },
          name: { first: 'Bob', last: 'Brown' },
          email: 'bob@example.com',
          location: { city: 'Paris', country: 'France' },
          phone: '444-555-666',
          picture: {
            thumbnail: 'bob.jpg',
            medium: 'bob_med.jpg',
            large: 'bob_large.jpg',
          },
        },
      ],
    };

    const expectedUsers: User[] = [
      {
        id: '1',
        name: 'Alice Smith',
        email: 'alice@example.com',
        city: 'London',
        country: 'UK',
        phone: '111-222-333',
        picture: 'alice.jpg',
      },
      {
        id: '2',
        name: 'Bob Brown',
        email: 'bob@example.com',
        city: 'Paris',
        country: 'France',
        phone: '444-555-666',
        picture: 'bob.jpg',
      },
    ];

    service.getUsers(2).subscribe((users) => {
      expect(users).toEqual(expectedUsers);
    });

    const req = httpMock.expectOne('https://randomuser.me/api/?results=2');
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });
});
