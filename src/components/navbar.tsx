"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useState } from "react";

export function Navbar() {
  const { data: session, status } = useSession();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery.trim())}`;
    }
  };

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="text-xl font-bold text-blue-600 whitespace-nowrap">
            💬 分享论坛
          </Link>

          {/* Search bar (desktop) */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-md mx-4">
            <input
              type="search"
              placeholder="搜索帖子..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm
                         focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </form>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-4">
            <Link href="/categories" className="text-gray-600 hover:text-blue-600 text-sm">
              分类
            </Link>

            {status === "loading" ? (
              <div className="w-16 h-5 bg-gray-200 animate-pulse rounded" />
            ) : session ? (
              <>
                <Link
                  href="/posts/create"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition"
                >
                  发帖
                </Link>
                <div className="relative group">
                  <button className="flex items-center gap-2 text-sm text-gray-700 hover:text-blue-600">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-medium">
                      {(session.user?.name || "U")[0].toUpperCase()}
                    </div>
                    <span className="hidden lg:inline">{session.user?.name || "用户"}</span>
                  </button>
                  {/* Dropdown */}
                  <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg
                                  opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                    <Link
                      href="/profile"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-t-lg"
                    >
                      👤 个人中心
                    </Link>
                    {session.user?.role === "ADMIN" && (
                      <Link
                        href="/admin"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        ⚙️ 管理后台
                      </Link>
                    )}
                    <button
                      onClick={() => signOut({ callbackUrl: "/" })}
                      className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 rounded-b-lg"
                    >
                      🚪 退出登录
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/login"
                  className="text-gray-600 hover:text-blue-600 text-sm px-3 py-2"
                >
                  登录
                </Link>
                <Link
                  href="/register"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition"
                >
                  注册
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-gray-600"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden pb-4 border-t border-gray-100 pt-3">
            <form onSubmit={handleSearch} className="mb-3">
              <input
                type="search"
                placeholder="搜索帖子..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm"
              />
            </form>
            <div className="flex flex-col gap-2">
              <Link href="/categories" className="text-gray-600 py-2 text-sm" onClick={() => setMobileMenuOpen(false)}>
                浏览分类
              </Link>
              {session ? (
                <>
                  <Link href="/posts/create" className="text-blue-600 py-2 text-sm font-medium" onClick={() => setMobileMenuOpen(false)}>
                    ✏️ 发帖
                  </Link>
                  <Link href="/profile" className="text-gray-600 py-2 text-sm" onClick={() => setMobileMenuOpen(false)}>
                    👤 个人中心
                  </Link>
                  {session.user?.role === "ADMIN" && (
                    <Link href="/admin" className="text-gray-600 py-2 text-sm" onClick={() => setMobileMenuOpen(false)}>
                      ⚙️ 管理后台
                    </Link>
                  )}
                  <button
                    onClick={() => signOut({ callbackUrl: "/" })}
                    className="text-left text-red-600 py-2 text-sm"
                  >
                    🚪 退出登录
                  </button>
                </>
              ) : (
                <div className="flex gap-2 mt-2">
                  <Link href="/login" className="flex-1 text-center border border-gray-300 text-gray-700 py-2 rounded-lg text-sm" onClick={() => setMobileMenuOpen(false)}>
                    登录
                  </Link>
                  <Link href="/register" className="flex-1 text-center bg-blue-600 text-white py-2 rounded-lg text-sm" onClick={() => setMobileMenuOpen(false)}>
                    注册
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
