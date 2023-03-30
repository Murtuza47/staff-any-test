import { Request, ResponseToolkit } from "@hapi/hapi";
import * as shiftUsecase from "../../../usecases/shiftUsecase";
import * as publishedWeekUsecase from "../../../usecases/publishedWeekUsecase";
import { errorHandler } from "../../../shared/functions/error";
import {
  ICreateShift,
  ISuccessResponse,
  IUpdateShift,
} from "../../../shared/interfaces";
import moduleLogger from "../../../shared/functions/logger";
import { Between, Equal, LessThan, MoreThan } from "typeorm";
import { endOfWeek, format, startOfWeek } from "date-fns";

const logger = moduleLogger("shiftController");

export const find = async (req: Request, h: ResponseToolkit) => {
  logger.info("Find shifts");
  try {
    const filter = req.query;
    const data = await shiftUsecase.find({
      order: filter.order,
      where: { date: Between(filter.startDayOfWeek, filter.endDayOfWeek) }
    });
    const res: ISuccessResponse = {
      statusCode: 200,
      message: "Get shift successful",
      results: data,
    };
    return res;
  } catch (error) {
    logger.error(error.message)
    return errorHandler(h, error);
  }
};

export const findById = async (req: Request, h: ResponseToolkit) => {
  logger.info("Find shift by id");
  try {
    const id = req.params.id;
    const data = await shiftUsecase.findById(id);
    const res: ISuccessResponse = {
      statusCode: 200,
      message: "Get shift successful",
      results: data,
    };
    return res;
  } catch (error) {
    logger.error(error.message)
    return errorHandler(h, error);
  }
};

export const create = async (req: Request, h: ResponseToolkit) => {
  logger.info("Create shift");
  try {
    const body = req.payload as ICreateShift;
    const date = new Date(body.date)
    const isPublishedWeekExists = await publishedWeekUsecase.find({
      where: { date: Between(format(startOfWeek(date), "yyyy-MM-dd"), format(endOfWeek(date), "yyyy-MM-dd")) }
    })
    const isShiftTimeOverlaping = await shiftUsecase.find({
      where: {
        startTime: LessThan(body.startTime),
        endTime: MoreThan(body.startTime),
        date: Equal(body.date)
      }
    });
    if (isPublishedWeekExists.length > 0) throw new Error("Date on this week is already Published")
    if (isShiftTimeOverlaping.length > 0) throw new Error("Start time is overlapping with other shift")
    const data = await shiftUsecase.create(body);
    const res: ISuccessResponse = {
      statusCode: 200,
      message: "Create shift successful",
      results: data,
    };
    return res;
  } catch (error) {
    logger.error(error.message)
    return errorHandler(h, error);
  }
};

export const updateById = async (req: Request, h: ResponseToolkit) => {
  logger.info("Update shift by id");
  try {
    const id = req.params.id;
    const body = req.payload as IUpdateShift;
    const date = new Date(body.date)
    const isPublishedWeekExists = await publishedWeekUsecase.find({
      where: { date: Between(format(startOfWeek(date), "yyyy-MM-dd"), format(endOfWeek(date), "yyyy-MM-dd")) }
    })
    const isShiftTimeOverlaping = await shiftUsecase.find({
      where: {
        startTime: LessThan(body.startTime),
        endTime: MoreThan(body.startTime),
        date: Equal(body.date)
      },
    });
    if (isPublishedWeekExists.length > 0) throw new Error("Date on this week is already Published")
    if (isShiftTimeOverlaping.filter(shift => {
      if (shift.id !== id) return shift
    }).length > 0) throw new Error("Start time is overlapping with other shift")
    const data = await shiftUsecase.updateById(id, body);
    const res: ISuccessResponse = {
      statusCode: 200,
      message: "Update shift successful",
      results: data,
    };
    return res;
  } catch (error) {
    logger.error(error.message)
    return errorHandler(h, error);
  }
};

export const deleteById = async (req: Request, h: ResponseToolkit) => {
  logger.info("Delete shift by id");
  try {
    const id = req.params.id;
    const data = await shiftUsecase.deleteById(id);
    const res: ISuccessResponse = {
      statusCode: 200,
      message: "Delete shift successful",
      results: data,
    };
    return res;
  } catch (error) {
    logger.error(error.message)
    return errorHandler(h, error);
  }
};

export const publish = async (req: Request, h: ResponseToolkit) => {
  logger.info("Publish all shifts");
  try {
    const filter = req.query;
    const shifts = await shiftUsecase.find({
      where: { date: Between(filter?.startDayOfWeek, filter?.endDayOfWeek) }
    });
    const publishedWeek = await publishedWeekUsecase.create({
      date: format(new Date(), "yyyy-MM-dd"),
      startOfWeek: filter?.startDayOfWeek,
      endOfWeek: filter?.endDayOfWeek
    })
    const data = await Promise.all(shifts.map(async (shift) => {
      const payload = {
        name: shift.name,
        date: shift.date,
        startTime: shift.startTime,
        endTime: shift.endTime,
        published: true,
        publishedDate: format(new Date(), "dd MMM yyyy"),
        weekId: publishedWeek.id
      };
      return await shiftUsecase.updateById(shift.id, payload)
    }))
    const res: ISuccessResponse = {
      statusCode: 200,
      message: "Shift published successful",
      results: data,
    };
    return res;
  } catch (error) {
    logger.error(error.message)
    return errorHandler(h, error);
  }
};