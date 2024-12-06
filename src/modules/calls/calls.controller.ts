import {
  Body,
  Controller,
  Get,
  Post,
  Param,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { CreateCallDto } from './dto/req/create-call.dto';
import { CallResDto } from './dto/res/call-res.dto';
import { CallsService } from './services/calls.service';
import { ApiCreatedResponse, ApiOperation } from '@nestjs/swagger';

@Controller('call')
export class CallsController {
  constructor(private readonly callsService: CallsService) {}

  @Post()
  @ApiOperation({
    summary: 'Create a new call',
    description: 'Create a new call entry with the provided details.',
  })
  @ApiCreatedResponse({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'The call has been successfully created.',
  })
  async create(@Body() createCallDto: CreateCallDto): Promise<{ id: string }> {
    return this.callsService.createCall(createCallDto);
  }

  @Get(':id')
  @HttpCode(HttpStatus.ACCEPTED)
  @ApiOperation({
    summary: 'Retrieve a call by ID',
    description: 'Get details of a specific call using its ID.',
  })
  @ApiCreatedResponse({
    type: CallResDto,
    description: 'The details of the call.',
  })
  async findOne(
    @Param('id') id: string,
  ): Promise<CallResDto | { status: number }> {
    return await this.callsService.getCall(id);
  }
}
