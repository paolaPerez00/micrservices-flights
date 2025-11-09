import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { FlightDTO } from './dto/flight.dto';
import { IFlight } from 'src/common/interface/flight.interface';
import { InjectModel } from '@nestjs/mongoose';
import { FLIGHT } from 'src/common/models/models';
import { Model } from 'mongoose';

@Injectable()
export class FlightService {

    constructor(@InjectModel(FLIGHT.name) private readonly model:Model<IFlight>){}

    async create(flightDto: FlightDTO): Promise<IFlight>{
        const newflight = new this.model(flightDto)
        return await newflight.save();
    }

    async findAll(): Promise<IFlight[]>{
        return await this.model.find().populate('passengers');
    }

    async findOne(id: string): Promise<IFlight>{
        const flight = await this.model.findById(id).populate('passengers');
        if (!flight) {
            throw new HttpException('Flight Not Found', HttpStatus.NOT_FOUND);
        }
        return flight;
    }

    async update(id: string, flightDto: FlightDTO): Promise<IFlight>{
        const flightUpdate = await this.model.findByIdAndUpdate(id, flightDto, { new: true });
        if (!flightUpdate) {
           throw new HttpException('Flight Not Found', HttpStatus.NOT_FOUND);
        }
        return flightUpdate;
    }

    async delete(id: string){
        await this.model.findByIdAndDelete(id);
        return { status: HttpStatus.OK, msg: 'Delete flight'};
    }

    async addPassenger(fligthId: string, passengerId: string): Promise<IFlight>{
        const updatedFlight = await this.model.findByIdAndUpdate(fligthId,
            { $addToSet: {passengers: passengerId} },
            { new: true }
        ).populate('passengers');
        if (!updatedFlight) {
            throw new HttpException('Flight Not Found', HttpStatus.NOT_FOUND);
        }
        return updatedFlight;
    }
}
