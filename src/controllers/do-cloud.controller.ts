import {TContainerList} from './../types/container';
import {intercept, service} from '@loopback/core';
import {get, param, post, requestBody, response} from '@loopback/rest';
import {IGetAccountApiResponse} from 'dots-wrapper/dist/account';
import {
  IListDropletsApiResponse,
  IGetDropletApiResponse,
} from 'dots-wrapper/dist/droplet';
import {
  EBandwidthNetworkInterface,
  EBandwidthTrafficDirection,
} from '../constants/enums/monitoring';
import {doCloudAuthInterceptor} from '../interceptors';
import {DOCloudService} from '../services';
import {IMonitoringMetrics} from '../types/monitoring';

const BASE_BATH = '/do-api';

export class DOCloudController {
  constructor(
    @service(DOCloudService)
    public doCloudService: DOCloudService,
  ) {}

  @post(`${BASE_BATH}/account`)
  @intercept(doCloudAuthInterceptor)
  @response(200)
  async doCloudLogin(): Promise<IGetAccountApiResponse> {
    const account = await this.doCloudService.getAccount();

    return account;
  }

  @get(`${BASE_BATH}/droplets`)
  @intercept(doCloudAuthInterceptor)
  @response(200)
  async getDroplets(): Promise<IListDropletsApiResponse> {
    const dropletList = await this.doCloudService.getDroplets();

    return dropletList;
  }

  @get(`${BASE_BATH}/droplets/{hostId}`)
  @intercept(doCloudAuthInterceptor)
  @response(200)
  async getDropletById(
    @param.path.string('hostId') hostId: string,
  ): Promise<IGetDropletApiResponse> {
    const droplet = await this.doCloudService.getDropletById(hostId);

    return droplet;
  }

  @get(`${BASE_BATH}/monitoring/metrics/bandwidth`)
  @intercept(doCloudAuthInterceptor)
  @response(200)
  async doDropletBandwidthMonitoring(
    @param.query.string('hostId') hostId: string,
    @param.query.string('start') start: string,
    @param.query.string('end') end: string,
    @param.query.string('networkInterface')
    networkInterface: EBandwidthNetworkInterface,
    @param.query.string('trafficDirection')
    trafficDirection: EBandwidthTrafficDirection,
  ): Promise<IMonitoringMetrics> {
    const dropletBandwidthMetrics =
      await this.doCloudService.getDropletBandwidthMetrics(
        hostId,
        start,
        end,
        networkInterface,
        trafficDirection,
      );

    return dropletBandwidthMetrics;
  }

  @get(`${BASE_BATH}/monitoring/metrics/memory`)
  @intercept(doCloudAuthInterceptor)
  @response(200)
  async doDropletMemoryMonitoring(
    @param.query.string('hostId') hostId: string,
    @param.query.string('start') start: string,
    @param.query.string('end') end: string,
  ): Promise<IMonitoringMetrics> {
    const dropletMemoryMetrics =
      await this.doCloudService.getDropletUsedMemoryMetrics(hostId, start, end);

    return dropletMemoryMetrics;
  }

  @get(`${BASE_BATH}/monitoring/metrics/cpu`)
  @intercept(doCloudAuthInterceptor)
  @response(200)
  async doDropletCPUMonitoring(
    @param.query.string('hostId') hostId: string,
    @param.query.string('start') start: string,
    @param.query.string('end') end: string,
  ): Promise<IMonitoringMetrics> {
    const dropletCPUMetrics = await this.doCloudService.getDropletCPUMetrics(
      hostId,
      start,
      end,
    );

    return dropletCPUMetrics;
  }

  @get(`${BASE_BATH}/containers`)
  @intercept(doCloudAuthInterceptor)
  @response(200)
  async doDropletContainerList(
    @param.query.string('hostId') hostId: string,
  ): Promise<TContainerList> {
    const containerList = await this.doCloudService.getDropletContainerList(
      hostId,
    );

    return containerList;
  }
}
