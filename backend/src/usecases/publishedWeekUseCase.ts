import * as publishedWeekRepository from "../database/default/repository/publishedWeekRepository";
import { FindManyOptions, FindOneOptions } from "typeorm";
import PublishedWeek from "../database/default/entity/publishedweek";
import { IPublishedWeek } from "../shared/interfaces/publsihedWeek";

export const find = async (opts: FindManyOptions<PublishedWeek>): Promise<PublishedWeek[]> => {
  return publishedWeekRepository.find(opts);
};

export const findById = async (
  id: string,
  opts?: FindOneOptions<PublishedWeek>
): Promise<PublishedWeek> => {
  return publishedWeekRepository.findById(id, opts);
};

export const create = async (payload: IPublishedWeek): Promise<PublishedWeek> => {
  const publishedWeek = new PublishedWeek();
  publishedWeek.date = payload.date;
  publishedWeek.startOfWeek = payload.startOfWeek;
  publishedWeek.endOfWeek = payload.endOfWeek;

  return publishedWeekRepository.create(publishedWeek);
};
