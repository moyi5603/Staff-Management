/** 省 / 市 / 区县 演示数据（覆盖 Mock 员工常用城市，非完整全国库） */

export interface RegionCity {
  city: string;
  districts: string[];
}

export interface RegionProvince {
  province: string;
  cities: RegionCity[];
}

export const CHINA_REGIONS: RegionProvince[] = [
  {
    province: '北京市',
    cities: [
      {
        city: '北京市',
        districts: ['东城区', '西城区', '朝阳区', '海淀区', '丰台区', '石景山区', '通州区'],
      },
    ],
  },
  {
    province: '上海市',
    cities: [
      {
        city: '上海市',
        districts: ['黄浦区', '徐汇区', '长宁区', '静安区', '浦东新区', '闵行区', '宝山区'],
      },
    ],
  },
  {
    province: '广东省',
    cities: [
      { city: '广州市', districts: ['天河区', '越秀区', '海珠区', '荔湾区', '番禺区', '白云区'] },
      { city: '深圳市', districts: ['福田区', '南山区', '罗湖区', '宝安区', '龙岗区', '龙华区'] },
      { city: '东莞市', districts: ['东城街道', '南城街道', '万江区', '松山湖'] },
    ],
  },
  {
    province: '四川省',
    cities: [
      { city: '成都市', districts: ['锦江区', '青羊区', '武侯区', '成华区', '高新区', '双流区'] },
    ],
  },
  {
    province: '浙江省',
    cities: [
      { city: '杭州市', districts: ['上城区', '拱墅区', '西湖区', '滨江区', '余杭区'] },
    ],
  },
  {
    province: '湖北省',
    cities: [{ city: '武汉市', districts: ['江岸区', '江汉区', '武昌区', '洪山区', '东湖高新区'] }],
  },
];

export const DEFAULT_WORK_LOCATION = {
  province: CHINA_REGIONS[0].province,
  city: CHINA_REGIONS[0].cities[0].city,
  district: CHINA_REGIONS[0].cities[0].districts[0],
};

export function getCitiesByProvince(province: string): RegionCity[] {
  return CHINA_REGIONS.find((p) => p.province === province)?.cities ?? [];
}

export function getDistrictsByCity(province: string, city: string): string[] {
  return getCitiesByProvince(province).find((c) => c.city === city)?.districts ?? [];
}
