import { useQuery } from "@tanstack/react-query";
import { Link, useLocation } from "wouter";

export default function SubmenuSection() {
  const { data } = useQuery({
    queryKey: ["/api/admin/submenus"],
  });

  const [location] = useLocation();

  const submenus = data?.submenus || [];
  if (submenus.length === 0) return null;

  const activeSubmenus = submenus
    .filter((m: any) => m.isActive)
    .sort((a: any, b: any) => {
      const orderA = a.displayOrder === 0 || a.displayOrder == null ? Infinity : a.displayOrder;
      const orderB = b.displayOrder === 0 || b.displayOrder == null ? Infinity : b.displayOrder;
      return orderA - orderB;
    });

  const hasRouteMatch = activeSubmenus.some(
    (menu: any) => location === menu.path
  );

  return (
    <section className="sticky top-16 z-40 bg-transparent">
      <div className="flex justify-center px-4">
        <div className="bg-[#8E7356] backdrop-blur-md shadow-md rounded-full">
          <div className="flex items-center gap-2 sm:gap-3">
            {activeSubmenus.map((submenu: any, index: number) => {
              const isActive =
                location === submenu.path || (!hasRouteMatch && index === 0);

              return (
                <Link
                  key={submenu.id}
                  href={submenu.path}
                  className={`relative text-sm font-medium px-4 py-1.5 rounded-full transition-all duration-200
                    ${
                      isActive
                        ? "bg-blue-600 text-white shadow-sm"
                        : "!text-white"
                    }`}
                >
                  {submenu.label}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
