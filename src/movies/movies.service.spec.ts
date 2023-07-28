import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Server } from 'http';
import { MoviesService } from './movies.service';

describe('MoviesService 테스트', () => {
  let service: MoviesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MoviesService],
    }).compile();

    service = module.get<MoviesService>(MoviesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getAll() 테스트', () => {
    it('should be Array', () => {
      const result = service.getAll();
      expect(result).toBeInstanceOf(Array);
    });
  });

  describe('getOne() 테스트', () => {
    it('should be return Movie data', () => {
      service.create({
        title: 'test',
        year: 2020,
        genres: ['test', 'test2'],
      });
      const movie = service.getOne(1);
      expect(movie).toBeDefined();
      expect(movie.id).toEqual(1);
    });
    it('should throw error', () => {
      try {
        service.getOne(999);
      } catch (err) {
        expect(err).toBeInstanceOf(NotFoundException);
      }
    });
  });

  describe('delete() 테스트', () => {
    it('delete a movie', () => {
      service.create({
        title: 'test',
        year: 2020,
        genres: ['test', 'test2'],
      });
      const beforeMovie = service.getAll().length;
      service.deleteOne(1);
      const afterMovie = service.getAll().length;
      expect(afterMovie).toBeLessThan(beforeMovie);
    });
    it('should throw error', () => {
      try {
        service.deleteOne(999);
      } catch (err) {
        expect(err).toBeInstanceOf(NotFoundException);
      }
    });
  });

  describe('create() 테스트', () => {
    it('should create movie', () => {
      const beforeMovie = service.getAll().length;
      service.create({
        title: 'test',
        year: 2020,
        genres: ['test', 'test2'],
      });
      const afterMovie = service.getAll().length;
      expect(afterMovie).toBeGreaterThan(beforeMovie);
    });
  });

  describe('update() 테스트', () => {
    it('should update movie', () => {
      service.create({
        title: 'test',
        year: 2020,
        genres: ['test', 'test2'],
      });
      service.update(1, {
        title: 'update test',
      });
      const movie = service.getOne(1).title;
      expect(movie).toEqual('update test');
    });
    it('should throw 404 error', () => {
      try {
        service.create({
          title: 'test',
          year: 2020,
          genres: ['test', 'test2'],
        });
        service.update(999, {
          title: 'update test',
        });
      } catch (err) {
        expect(err).toBeInstanceOf(NotFoundException);
      }
    });
  });
});
