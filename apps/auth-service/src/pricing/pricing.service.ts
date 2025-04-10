import { HttpStatus, Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Pricing, PricingDocument } from './schemas/pricing.schema';
import {
   APIResponse,
   CreatePricingDTO,
   QueryPricingDTO,
   UpdatePricingDTO,
} from '@app/types';

@Injectable()
export class PricingService {
   constructor(
      @InjectModel(Pricing.name) private pricingModel: Model<PricingDocument>,
   ) {}

   async create(
      createPricingDTO: CreatePricingDTO,
   ): Promise<APIResponse<PricingDocument>> {
      const pricing = await this.pricingModel.findOne({
         $or: [{ name: createPricingDTO.name }],
      });

      if (pricing && pricing.isDeleted === true) {
         throw new RpcException({
            message: 'Pricing with this name already exists',
            statusCode: HttpStatus.CONFLICT,
         });
      }

      const savedPricing = await new this.pricingModel(createPricingDTO).save();

      return {
         message: 'Pricing created successfully',
         data: savedPricing,
      };
   }

   async findAll(
      query: QueryPricingDTO,
   ): Promise<APIResponse<PricingDocument[]>> {
      const filter: any = { isDeleted: { $ne: true } };

      if (query.id) filter._id = query.id;
      if (query.name) filter.name = { $regex: query.name, $options: 'i' };
      if (query.duration) filter.duration = query.duration;

      const pricings = await this.pricingModel.find(filter).exec();

      if (!pricings || pricings.length === 0) {
         throw new RpcException({
            message: 'No pricings found',
            statusCode: HttpStatus.NOT_FOUND,
         });
      }

      return {
         message: 'Pricings retrieved successfully',
         data: pricings,
      };
   }

   async findOne(id: string): Promise<APIResponse<PricingDocument>> {
      const pricing = await this.pricingModel
         .findById(id)
         .where({ isDeleted: { $ne: true } })
         .exec();
      if (!pricing) {
         throw new RpcException({
            message: 'No pricing found',
            statusCode: HttpStatus.NOT_FOUND,
         });
      }
      return {
         message: 'Pricing retrieved successfully',
         data: pricing,
      };
   }

   async update(
      id: string,
      updatePricingDTO: UpdatePricingDTO,
   ): Promise<APIResponse<PricingDocument>> {
      const updatedPricing = await this.pricingModel
         .findByIdAndUpdate(
            id,
            { ...updatePricingDTO, $inc: { __v: 1 } },
            { new: true },
         )
         .where({ isDeleted: { $ne: true } })
         .exec();
      if (!updatedPricing) {
         throw new RpcException({
            message: 'Pricing not found',
            statusCode: HttpStatus.NOT_FOUND,
         });
      }
      return {
         message: 'Pricing updated successfully',
         data: updatedPricing,
      };
   }

   async remove(id: string): Promise<APIResponse<null>> {
      const result = await this.pricingModel
         .findOneAndUpdate(
            { _id: id, isDeleted: { $ne: true } },
            { isDeleted: true },
            { new: true },
         )
         .exec();
      if (!result) {
         throw new RpcException({
            message: 'Pricing not found or already deleted',
            statusCode: HttpStatus.NOT_FOUND,
         });
      }
      return {
         message: 'Pricing deleted successfully',
         data: null,
      };
   }
}
