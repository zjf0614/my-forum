import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 开始创建种子数据...");

  // ── 创建分类 ──
  const categories = [
    {
      name: "综合讨论",
      slug: "general",
      description: "任何话题都可以在这里讨论",
    },
    {
      name: "技术交流",
      slug: "tech",
      description: "编程、AI、科技相关话题",
    },
    {
      name: "游戏娱乐",
      slug: "gaming",
      description: "游戏、动漫、影视讨论",
    },
    {
      name: "书籍阅读",
      slug: "books",
      description: "读书笔记、好书推荐、阅读心得",
    },
    {
      name: "音乐分享",
      slug: "music",
      description: "分享你喜欢的音乐和音乐人",
    },
    {
      name: "求助问答",
      slug: "help",
      description: "有问题？来这里求助",
    },
  ];

  for (const cat of categories) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    });
  }

  console.log(`✓ 创建了 ${categories.length} 个分类`);

  // ── 如果没有管理员，创建一个 ──
  const adminEmail = "admin@forum.com";
  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail },
  });

  if (!existingAdmin) {
    // 密码: admin123456 (仅用于初始设置，请登录后修改)
    const bcrypt = await import("bcryptjs");
    const hashedPassword = await bcrypt.hash("admin123456", 12);

    await prisma.user.create({
      data: {
        name: "管理员",
        email: adminEmail,
        hashedPassword,
        role: "ADMIN",
      },
    });
    console.log(`✓ 创建了管理员账号: ${adminEmail} (密码: admin123456)`);
  } else {
    console.log("  管理员账号已存在，跳过");
  }

  console.log("✅ 种子数据创建完成！");
}

main()
  .catch((e) => {
    console.error("❌ 种子数据创建失败:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
