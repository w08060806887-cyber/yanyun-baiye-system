import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');

const expectedHotspots = [
  ['home-nav-main', "showPage('homePage')"],
  ['home-nav-war', "showPage('baiyePage')"],
  ['home-nav-xj', "showPage('xjPage')"],
  ['home-nav-zhongzhi', "showPage('zhongzhiPage')"],
  ['home-nav-members', "showPage('baiyeMembersPage')"],
  ['home-nav-monthly', "showPage('monthlyPage')"],
  ['home-nav-command', "showPage('baiyeArrangePage')"],
  ['home-card-war', "showPage('baiyePage')"],
  ['home-card-xj', "showPage('xjPage')"],
  ['home-card-zhongzhi', "showPage('zhongzhiPage')"],
  ['home-card-members', "showPage('baiyeMembersPage')"],
  ['home-card-monthly', "showPage('monthlyPage')"],
];

assert.match(html, /src="assets\/wangshi-home\.png"/, 'homepage should use the new asset file');

for (const [className, action] of expectedHotspots) {
  assert.match(html, new RegExp(`class="hotspot ${className}"`), `missing ${className}`);
  assert.match(html, new RegExp(`class="hotspot ${className}"[^>]+onclick="${action.replace(/[()']/g, '\\$&')}"`), `${className} should call ${action}`);
}

assert.match(html, /id="zhongzhiPage"/, '眾志凌霄 page should exist');
assert.match(html, /id="zhongzhiName"/, '眾志凌霄 should include role name input');
assert.match(html, /id="zhongzhiTotalDamage"/, '眾志凌霄 should include total damage input');
assert.match(html, /id="zhongzhiSchool"/, '眾志凌霄 should include school input');
assert.match(html, /<select id="zhongzhiSchool"/, '眾志凌霄 main school should be a dropdown');
assert.match(html, /id="zhongzhiDps"/, '眾志凌霄 should include auto DPS display');
assert.match(html, /name="zhongzhiTimes" value="週四"/, '眾志凌霄 should include Thursday checkbox');
assert.match(html, /name="zhongzhiTimes" value="週五"/, '眾志凌霄 should include Friday checkbox');
assert.match(html, /name="zhongzhiTimes" value="週六"/, '眾志凌霄 should include Saturday checkbox');
assert.match(html, /name="zhongzhiTimes" value="週日"/, '眾志凌霄 should include Sunday checkbox');
assert.match(html, /id="zhongzhiList"/, '眾志凌霄 should include signup list');
assert.match(html, /function\s+submitZhongzhiSignup/, '眾志凌霄 should save signups');
assert.match(html, /function\s+renderZhongzhiList/, '眾志凌霄 should render sorted list');
assert.match(html, /function\s+updateZhongzhiDps/, '眾志凌霄 should calculate DPS automatically');
assert.match(html, /function\s+renderZhongzhiAdminStats/, '指揮後台 should render Zhongzhi admin stats');
assert.match(html, /id="zhongzhiTimeStats"/, '指揮後台 should include time availability stats');
assert.match(html, /id="zhongzhiSchoolStats"/, '指揮後台 should include school stats');
assert.match(html, /id="zhongzhiDamageRank"/, '指揮後台 should include damage ranking');
assert.match(html, /id="zhongzhiDpsRank"/, '指揮後台 should include DPS ranking');
assert.doesNotMatch(html, /id="zhongzhiMinuteDamage"/, '眾志凌霄 should not ask players to type DPS manually');
assert.doesNotMatch(html, /望獅閣｜報名系統施工中|報名入口已預留/, '眾志凌霄 should not show placeholder text');
assert.match(html, /id="baiyeArrangeViewPage"/, '編排查看頁 should exist');
assert.match(html, /編排查看密碼/, '指揮後台 should include view password controls');
assert.match(html, /const\s+BAIYE_ADMIN_PASSWORD_V20='yanyun888'/, '指揮後台 password should remain configured');
assert.match(html, /const\s+DEFAULT_ARRANGE_VIEW_PASSWORD='wsg0704'/, 'view password should have default value');
assert.match(html, /function\s+loginArrangeView/, '編排查看頁 should require password login');
assert.match(html, /function\s+renderBaiyeArrangeView/, '編排查看頁 should render read-only arrange');
assert.match(html, /function\s+saveArrangeViewPassword/, '指揮後台 should update view password');
assert.doesNotMatch(html, /COMMAND_PASSWORD|指揮後台密碼/, 'legacy command password names should not be used');

const playerVisibleBannedText = [
  '未登入管理時，玩家可查看人員配置；登入後才可新增、編輯、刪除。',
  '人員配置管理',
  '管理權限不再放在前端',
  '目前：查看模式，只能查看，不能管理。',
  '管理權限不再使用前端密碼',
  '請先登入管理',
  '管理模式',
  '管理密碼',
  '管理員密碼',
  '密碼錯誤',
  '資料目前存在本機 LocalStorage',
  'Firebase members 同步版',
  'Realtime Database',
  '百業俠境已啟用 Firebase 多人同步',
  'Firebase 連線失敗',
  'Firebase 尚未連線',
  '請檢查 Firebase',
  'members 同步失敗',
  '新增 / 編輯成員',
];

for (const text of playerVisibleBannedText) {
  assert.doesNotMatch(html, new RegExp(text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')), `player-facing HTML should not include "${text}"`);
}

const baiyePageMatch = html.match(/<section id="baiyePage"[\s\S]*?<section id="baiyeMembersPage"/);
assert.ok(baiyePageMatch, '百業戰報名頁區塊 should be present');
const baiyePage = baiyePageMatch[0];
assert.doesNotMatch(baiyePage, /showPage\('baiyeMembersPage'\)/, '百業戰頁內 should not link to 人員配置');
assert.doesNotMatch(baiyePage, /showPage\('monthlyPage'\)/, '百業戰頁內 should not link to 月結系統');
